import { ponder } from "ponder:registry";
import { getConfig } from "./utils/chains";
import { bundles, poolManagers, pools, tokens } from "ponder:schema";
import { zeroAddress } from "viem";
import { fetchTokenDecimals, fetchTokenName, fetchTokenSymbol, fetchTokenTotalSupply } from "./utils/token";
import { calculateAmountUSD, sqrtPriceX96ToTokenPrices } from "./utils/pricing";
import { convertTokenToDecimal } from "./utils";
import Decimal from "decimal.js";

ponder.on("PoolManager:Initialize", async ({ event, context }) => {
  console.log(event.args);

  const config = getConfig(context.chain.name);

  const poolManagerAddress = config.poolManagerAddress;
  const whitelistTokens = config.whitelistTokens;
  const tokenOverrides = config.tokenOverrides;
  const poolsToSkip = config.poolsToSkip;
  const stablecoinWrappedNativePoolId = config.stablecoinWrappedNativePoolId;
  const stablecoinIsToken0 = config.stablecoinIsToken0;
  const wrappedNativeAddress = config.wrappedNativeAddress;
  const stablecoinAddresses = config.stablecoinAddresses;
  const minimumNativeLocked = config.minimumNativeLocked;
  const nativeTokenDetails = config.nativeTokenDetails;

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
    // TODO: why id: 1?
    await context.db.insert(bundles).values({
      id: '1',
      ethPriceUsd: 0
    });
  }

  // increment pool count
  await context.db
    .update(poolManagers, { id: poolManagerAddress })
    .set((row) => ({ poolCount: row.poolCount + 1n }));

  let token0 = await context.db.find(tokens, { id: event.args.currency0 });
  let token1 = await context.db.find(tokens, { id: event.args.currency1 });

  // fetch info if null
  if (token0 === null) {
    const tokenAddress = event.args.currency0;

    const symbol = await fetchTokenSymbol(context.client, tokenAddress, tokenOverrides, nativeTokenDetails);

    const name = await fetchTokenName(context.client, tokenAddress, tokenOverrides, nativeTokenDetails);

    const totalSupply = await fetchTokenTotalSupply(context.client, tokenAddress);

    const decimals = await fetchTokenDecimals(context.client, tokenAddress, tokenOverrides, nativeTokenDetails);

    // bail if we couldn't figure out the decimals
    if (decimals === null) {
      console.debug('mybug the decimal on token 0 was null', [])
      return;
    }

    token0 = await context.db.insert(tokens).values({
      id: tokenAddress,
      symbol,
      name,
      decimals,
      totalSupply,
      // TODO: use defaults in schema instead?
      derivedETH: 0,
      volume: 0,
      volumeUSD: 0,
      feesUSD: 0,
      untrackedVolumeUSD: 0,
      totalValueLocked: 0,
      totalValueLockedUSD: 0,
      totalValueLockedUSDUntracked: 0,
      txCount: 0n,
      poolCount: 0n,
      // whitelistPools
    });

  }

  if (token1 === null) {
    const tokenAddress = event.args.currency1;

    const symbol = await fetchTokenSymbol(context.client, tokenAddress, tokenOverrides, nativeTokenDetails);

    const name = await fetchTokenName(context.client, tokenAddress, tokenOverrides, nativeTokenDetails);

    const totalSupply = await fetchTokenTotalSupply(context.client, tokenAddress);

    const decimals = await fetchTokenDecimals(context.client, tokenAddress, tokenOverrides, nativeTokenDetails);

    // bail if we couldn't figure out the decimals
    if (decimals === null) {
      console.debug('mybug the decimal on token 1 was null', [])
      return;
    }

    token1 = await context.db.insert(tokens).values({
      id: tokenAddress,
      symbol,
      name,
      decimals,
      totalSupply,
      // TODO: use defaults in schema instead?
      derivedETH: 0,
      volume: 0,
      volumeUSD: 0,
      feesUSD: 0,
      untrackedVolumeUSD: 0,
      totalValueLocked: 0,
      totalValueLockedUSD: 0,
      totalValueLockedUSDUntracked: 0,
      txCount: 0n,
      poolCount: 0n,
      // whitelistPools
    });

  }

  const pool = await context.db.insert(pools).values({
    id: poolId,
    token0: token0.id,
    token1: token1.id,
    feeTier: BigInt(event.args.fee),
    hooks: event.args.hooks,
    tickSpacing: BigInt(event.args.tickSpacing),
    createdAtTimestamp: event.block.timestamp,
    createdAtBlockNumber: event.block.number,
    liquidityProviderCount: 0n,
    txCount: 0n,
    liquidity: 0n,
    // TODO: duplicate field in Uniswap subgraph
    // Likely bug - see https://github.com/Uniswap/v4-subgraph/blob/5687eb8993f6d6bac6abe5127096a05b5af9ea30/src/mappings/poolManager.ts#L142
    // sqrtPrice: 0n,
    token0Price: 0,
    token1Price: 0,
    observationIndex: 0n,
    totalValueLockedToken0: 0,
    totalValueLockedToken1: 0,
    totalValueLockedUSD: 0,
    totalValueLockedETH: 0,
    totalValueLockedUSDUntracked: 0,
    volumeToken0: 0,
    volumeToken1: 0,
    volumeUSD: 0,
    feesUSD: 0,
    untrackedVolumeUSD: 0,

    collectedFeesToken0: 0,
    collectedFeesToken1: 0,
    collectedFeesUSD: 0,

    sqrtPrice: event.args.sqrtPriceX96,
    tick: BigInt(event.args.tick),
  });

  // TODO: implement whitelisted pools
  // update white listed pools
  // if (whitelistTokens.includes(token0.id)) {
  //   const result = await context.db.sql.query.tokens.findFirst({
  //     where: eq(tokens.id, token1.id),
  //     with: { whitelistPools: true }
  //   });

  //   const newPools = result?.whitelistPools ?? [];
  //   newPools.push(pool.id);

  //   await context.db.update(tokens, { id: token1.id }).set({
  //     whitelistPools: [...whitelistPools, pool.id],
  //   });

  //   const newPools = token1.whitelistPools
  //   newPools.push(pool.id)
  //   token1.whitelistPools = newPools
  // }
  // if (whitelistTokens.includes(token1.id)) {
  //   const newPools = token0.whitelistPools
  //   newPools.push(pool.id)
  //   token0.whitelistPools = newPools
  // }


  const prices = sqrtPriceX96ToTokenPrices(pool.sqrtPrice, token0, token1, nativeTokenDetails);
  pool.token0Price = prices[0].toNumber()
  pool.token1Price = prices[1].toNumber()


  // TODO: implement below
  // update prices
  // update ETH price now that prices could have changed
  // const bundle = Bundle.load('1')!
  // bundle.ethPriceUSD = getNativePriceInUSD(stablecoinWrappedNativePoolId, stablecoinIsToken0)
  // bundle.save()
  // updatePoolDayData(poolId, event)
  // updatePoolHourData(poolId, event)
  // token1.derivedETH = findNativePerToken(token1, wrappedNativeAddress, stablecoinAddresses, minimumNativeLocked)
  // token0.derivedETH = findNativePerToken(token0, wrappedNativeAddress, stablecoinAddresses, minimumNativeLocked)

  // token0.save()
  // token1.save()
});

ponder.on("PoolManager:ModifyLiquidity", async ({ event, context }) => {
  console.log(event.args);

  const config = getConfig(context.chain.name);
  const poolManagerAddress = config.poolManagerAddress;

  const bundle = await context.db.find(bundles, { id: '1' });
  if (bundle === null) {
    console.debug('handleModifyLiquidityHelper: bundle not found {}', ['1'])
    return;
  }

  const poolId = event.args.id;
  const pool = await context.db.find(pools, { id: poolId });
  if (pool === null) {
    console.debug('handleModifyLiquidityHelper: pool not found {}', [poolId])
    return;
  }

  const poolManager = await context.db.find(poolManagers, { id: poolManagerAddress });
  if (poolManager === null) {
    console.debug('handleModifyLiquidityHelper: pool manager not found {}', [poolManagerAddress])
    return;
  }

  const token0 = await context.db.find(tokens, { id: pool.token0 });
  const token1 = await context.db.find(tokens, { id: pool.token1 });

  if (token0 && token1) {
    const currTick = pool.tick
    const currSqrtPriceX96 = pool.sqrtPrice

    // Get the amounts using the getAmounts function
    const amount0Raw = getAmount0(
      event.args.tickLower,
      event.args.tickUpper,
      currTick,
      event.args.liquidityDelta,
      currSqrtPriceX96,
    )
    const amount1Raw = getAmount1(
      event.args.tickLower,
      event.args.tickUpper,
      currTick,
      event.args.liquidityDelta,
      currSqrtPriceX96,
    )
    const amount0 = convertTokenToDecimal(amount0Raw, token0.decimals)
    const amount1 = convertTokenToDecimal(amount1Raw, token1.decimals)

    const amountUSD = calculateAmountUSD(
      amount0,
      amount1,
      new Decimal(token0.derivedETH),
      new Decimal(token1.derivedETH),
      new Decimal(bundle.ethPriceUSD)
    );

    // reset tvl aggregates until new amounts calculated
    poolManager.totalValueLockedETH = Decimal(poolManager.totalValueLockedETH).minus(pool.totalValueLockedETH).toNumber();

    // update globals
    poolManager.txCount = poolManager.txCount + 1n;

    // update token0 data
    token0.txCount = token0.txCount + 1n;
    token0.totalValueLocked = Decimal(token0.totalValueLocked).plus(amount0).toNumber();
    token0.totalValueLockedUSD = Decimal(token0.totalValueLocked).times(Decimal(token0.derivedETH).times(bundle.ethPriceUSD)).toNumber();

    // update token1 data
    token1.txCount = token1.txCount + 1n;
    token1.totalValueLocked = Decimal(token1.totalValueLocked).plus(amount1).toNumber();
    token1.totalValueLockedUSD = Decimal(token1.totalValueLocked).times(Decimal(token1.derivedETH).times(bundle.ethPriceUSD)).toNumber();

    // pool data
    pool.txCount = pool.txCount + 1n;

    // Pools liquidity tracks the currently active liquidity given pools current tick.
    // We only want to update it if the new position includes the current tick.
    if (
      pool.tick !== null &&
      BigInt.fromI32(event.params.tickLower).le(pool.tick as BigInt) &&
      BigInt.fromI32(event.params.tickUpper).gt(pool.tick as BigInt)
    ) {
      pool.liquidity = pool.liquidity.plus(event.params.liquidityDelta)
    }

    pool.totalValueLockedToken0 = pool.totalValueLockedToken0.plus(amount0)
    pool.totalValueLockedToken1 = pool.totalValueLockedToken1.plus(amount1)
    pool.totalValueLockedETH = pool.totalValueLockedToken0
      .times(token0.derivedETH)
      .plus(pool.totalValueLockedToken1.times(token1.derivedETH))
    pool.totalValueLockedUSD = pool.totalValueLockedETH.times(bundle.ethPriceUSD)

    // reset aggregates with new amounts
    poolManager.totalValueLockedETH = poolManager.totalValueLockedETH.plus(pool.totalValueLockedETH)
    poolManager.totalValueLockedUSD = poolManager.totalValueLockedETH.times(bundle.ethPriceUSD)

    const transaction = loadTransaction(event)
    const modifyLiquidity = new ModifyLiquidity(transaction.id.toString() + '-' + event.logIndex.toString())
    modifyLiquidity.transaction = transaction.id
    modifyLiquidity.timestamp = transaction.timestamp
    modifyLiquidity.pool = pool.id
    modifyLiquidity.token0 = pool.token0
    modifyLiquidity.token1 = pool.token1
    modifyLiquidity.sender = event.params.sender
    modifyLiquidity.origin = event.transaction.from
    modifyLiquidity.amount = event.params.liquidityDelta
    modifyLiquidity.amount0 = amount0
    modifyLiquidity.amount1 = amount1
    modifyLiquidity.amountUSD = amountUSD
    modifyLiquidity.tickLower = BigInt.fromI32(event.params.tickLower)
    modifyLiquidity.tickUpper = BigInt.fromI32(event.params.tickUpper)
    modifyLiquidity.logIndex = event.logIndex

    // tick entities
    const lowerTickIdx = event.params.tickLower
    const upperTickIdx = event.params.tickUpper

    const lowerTickId = poolId + '#' + BigInt.fromI32(event.params.tickLower).toString()
    const upperTickId = poolId + '#' + BigInt.fromI32(event.params.tickUpper).toString()

    let lowerTick = Tick.load(lowerTickId)
    let upperTick = Tick.load(upperTickId)

    if (lowerTick === null) {
      lowerTick = createTick(lowerTickId, lowerTickIdx, pool.id, event)
    }

    if (upperTick === null) {
      upperTick = createTick(upperTickId, upperTickIdx, pool.id, event)
    }

    const amount = event.params.liquidityDelta
    lowerTick.liquidityGross = lowerTick.liquidityGross.plus(amount)
    lowerTick.liquidityNet = lowerTick.liquidityNet.plus(amount)
    upperTick.liquidityGross = upperTick.liquidityGross.plus(amount)
    upperTick.liquidityNet = upperTick.liquidityNet.minus(amount)

    lowerTick.save()
    upperTick.save()

    updateUniswapDayData(event, poolManagerAddress)
    updatePoolDayData(event.params.id.toHexString(), event)
    updatePoolHourData(event.params.id.toHexString(), event)
    updateTokenDayData(token0, event)
    updateTokenDayData(token1, event)
    updateTokenHourData(token0, event)
    updateTokenHourData(token1, event)

    token0.save()
    token1.save()
    pool.save()
    poolManager.save()
    modifyLiquidity.save()
  }
});

ponder.on("PoolManager:Swap", async ({ event, context }) => {
  console.log(event.args);
});