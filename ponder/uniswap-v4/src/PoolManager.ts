import { ponder } from "ponder:registry";
import { getConfig } from "./utils/chains";
import { bundles, poolManagers, pools, tokens } from "ponder:schema";
import { zeroAddress } from "viem";
import { fetchTokenDecimals, fetchTokenName, fetchTokenSymbol, fetchTokenTotalSupply } from "./utils/token";
import { sqrtPriceX96ToTokenPrices } from "./utils/pricing";

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
});

ponder.on("PoolManager:Swap", async ({ event, context }) => {
  console.log(event.args);
});