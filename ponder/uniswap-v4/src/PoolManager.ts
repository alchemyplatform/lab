import { ponder } from "ponder:registry";
import { getConfig } from "./utils/chains";
import { poolManagers } from "ponder:schema";
import { zeroAddress } from "viem";

ponder.on("PoolManager:Initialize", async ({ event, context }) => {
  console.log(event.args);

  const config = getConfig(context.chain.name);

  const poolManagerAddress = config.poolManagerAddress
  const whitelistTokens = config.whitelistTokens
  const tokenOverrides = config.tokenOverrides
  const poolsToSkip = config.poolsToSkip
  const stablecoinWrappedNativePoolId = config.stablecoinWrappedNativePoolId
  const stablecoinIsToken0 = config.stablecoinIsToken0
  const wrappedNativeAddress = config.wrappedNativeAddress
  const stablecoinAddresses = config.stablecoinAddresses
  const minimumNativeLocked = config.minimumNativeLocked
  const nativeTokenDetails = config.nativeTokenDetails
  const poolId = event.args.id;

  if (poolsToSkip.includes(poolId)) {
    return
  }

  // load pool manager
  let poolManager = await context.db.find(poolManagers, { id: poolManagerAddress });
  if (poolManager === null) {
    poolManager = await context.db.insert(poolManagers).values({
      id: poolManagerAddress,
      poolCount: 0n,
      totalVolumeETH: 0,
      totalVolumeUSD: 0,
      untrackedVolumeUSD: 0,
      totalFeesUSD: 0,
      totalFeesETH: 0,
      totalValueLockedUSD: 0,
      totalValueLockedETH: 0,
      totalValueLockedUSDUntracked: 0,
      totalValueLockedETHUntracked: 0,
      txCount: 0n,
      owner: zeroAddress,
    });

    // create new bundle for tracking eth price
    const bundle = new Bundle('1')
    bundle.ethPriceUSD = ZERO_BD
    bundle.save()
  }

  poolManager.poolCount = poolManager.poolCount.plus(ONE_BI)
  const pool = new Pool(poolId)
  let token0 = Token.load(event.params.currency0.toHexString())
  let token1 = Token.load(event.params.currency1.toHexString())

  // fetch info if null
  if (token0 === null) {
    token0 = new Token(event.params.currency0.toHexString())
    token0.symbol = fetchTokenSymbol(event.params.currency0, tokenOverrides, nativeTokenDetails)
    token0.name = fetchTokenName(event.params.currency0, tokenOverrides, nativeTokenDetails)
    token0.totalSupply = fetchTokenTotalSupply(event.params.currency0)
    const decimals = fetchTokenDecimals(event.params.currency0, tokenOverrides, nativeTokenDetails)

    // bail if we couldn't figure out the decimals
    if (decimals === null) {
      log.debug('mybug the decimal on token 0 was null', [])
      return
    }

    token0.decimals = decimals
    token0.derivedETH = ZERO_BD
    token0.volume = ZERO_BD
    token0.volumeUSD = ZERO_BD
    token0.feesUSD = ZERO_BD
    token0.untrackedVolumeUSD = ZERO_BD
    token0.totalValueLocked = ZERO_BD
    token0.totalValueLockedUSD = ZERO_BD
    token0.totalValueLockedUSDUntracked = ZERO_BD
    token0.txCount = ZERO_BI
    token0.poolCount = ZERO_BI
    token0.whitelistPools = []
  }

  if (token1 === null) {
    token1 = new Token(event.params.currency1.toHexString())
    token1.symbol = fetchTokenSymbol(event.params.currency1, tokenOverrides, nativeTokenDetails)
    token1.name = fetchTokenName(event.params.currency1, tokenOverrides, nativeTokenDetails)
    token1.totalSupply = fetchTokenTotalSupply(event.params.currency1)
    const decimals = fetchTokenDecimals(event.params.currency1, tokenOverrides, nativeTokenDetails)

    if (decimals === null) {
      log.debug('mybug the decimal on token 0 was null', [])
      return
    }

    token1.decimals = decimals
    token1.derivedETH = ZERO_BD
    token1.volume = ZERO_BD
    token1.volumeUSD = ZERO_BD
    token1.untrackedVolumeUSD = ZERO_BD
    token1.feesUSD = ZERO_BD
    token1.totalValueLocked = ZERO_BD
    token1.totalValueLockedUSD = ZERO_BD
    token1.totalValueLockedUSDUntracked = ZERO_BD
    token1.txCount = ZERO_BI
    token1.poolCount = ZERO_BI
    token1.whitelistPools = []
  }

  // update white listed pools
  if (whitelistTokens.includes(token0.id)) {
    const newPools = token1.whitelistPools
    newPools.push(pool.id)
    token1.whitelistPools = newPools
  }
  if (whitelistTokens.includes(token1.id)) {
    const newPools = token0.whitelistPools
    newPools.push(pool.id)
    token0.whitelistPools = newPools
  }

  pool.token0 = token0.id
  pool.token1 = token1.id
  pool.feeTier = BigInt.fromI32(event.params.fee)
  pool.hooks = event.params.hooks.toHexString()
  pool.tickSpacing = BigInt.fromI32(event.params.tickSpacing)
  pool.createdAtTimestamp = event.block.timestamp
  pool.createdAtBlockNumber = event.block.number
  pool.liquidityProviderCount = ZERO_BI
  pool.txCount = ZERO_BI
  pool.liquidity = ZERO_BI
  pool.sqrtPrice = ZERO_BI
  pool.token0Price = ZERO_BD
  pool.token1Price = ZERO_BD
  pool.observationIndex = ZERO_BI
  pool.totalValueLockedToken0 = ZERO_BD
  pool.totalValueLockedToken1 = ZERO_BD
  pool.totalValueLockedUSD = ZERO_BD
  pool.totalValueLockedETH = ZERO_BD
  pool.totalValueLockedUSDUntracked = ZERO_BD
  pool.volumeToken0 = ZERO_BD
  pool.volumeToken1 = ZERO_BD
  pool.volumeUSD = ZERO_BD
  pool.feesUSD = ZERO_BD
  pool.untrackedVolumeUSD = ZERO_BD

  pool.collectedFeesToken0 = ZERO_BD
  pool.collectedFeesToken1 = ZERO_BD
  pool.collectedFeesUSD = ZERO_BD

  pool.sqrtPrice = event.params.sqrtPriceX96
  pool.tick = BigInt.fromI32(event.params.tick)

  const prices = sqrtPriceX96ToTokenPrices(pool.sqrtPrice, token0, token1, nativeTokenDetails)
  pool.token0Price = prices[0]
  pool.token1Price = prices[1]

  pool.save()
  token0.save()
  token1.save()
  poolManager.save()

  // update prices
  // update ETH price now that prices could have changed
  const bundle = Bundle.load('1')!
  bundle.ethPriceUSD = getNativePriceInUSD(stablecoinWrappedNativePoolId, stablecoinIsToken0)
  bundle.save()
  updatePoolDayData(poolId, event)
  updatePoolHourData(poolId, event)
  token1.derivedETH = findNativePerToken(token1, wrappedNativeAddress, stablecoinAddresses, minimumNativeLocked)
  token0.derivedETH = findNativePerToken(token0, wrappedNativeAddress, stablecoinAddresses, minimumNativeLocked)

  token0.save()
  token1.save()
});

ponder.on("PoolManager:ModifyLiquidity", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("PoolManager:Swap", async ({ event, context }) => {
  console.log(event.args);
});