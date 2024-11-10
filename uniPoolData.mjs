import fetch from 'node-fetch'

const urlForProtocol = (protocol) => {
  return "https://gateway.thegraph.com/api/536af9ae001b0f1c18a14cf5b14145fc/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV";
}

const requestBody = (request) => {
  
  if(!request.query) return;

  const body = {
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query: request.query,
        variables: request.variables || {}
      })
  }

  if (request.signal) body.signal = request.signal;
  return body;

}

export const getPoolHourData = async (pool, fromdate, todate, protocol) => {

  const query =  `query PoolHourDatas($pool: ID!, $fromdate: Int!, $todate: Int!) {
  poolHourDatas ( where:{ pool:$pool, periodStartUnix_gt:$fromdate periodStartUnix_lt:$todate close_gt: 0}, orderBy:periodStartUnix, orderDirection:desc, first:1000) {
    periodStartUnix
    liquidity
    high
    low
    pool {
      id
      totalValueLockedUSD
      totalValueLockedToken1
      totalValueLockedToken0
      token0
        {decimals}
      token1
        {decimals}
    }
    close
    feeGrowthGlobal0X128
    feeGrowthGlobal1X128
    }
  }
  `

  const url = urlForProtocol(protocol);

  try {
    const response = await fetch(url, requestBody({query: query, variables: {pool: pool, fromdate: fromdate, todate} }));
    const data = await response.json();

    if (data && data.data && data.data.poolHourDatas) {
     
      return data.data.poolHourDatas;
    }
    else {
      console.log("nothing returned from getPoolHourData")
      return null;
    }

  } catch (error) {
    return {error: error};
  }

}


export const poolById = async (id, protocol) => {

  const url = urlForProtocol(protocol);

  const poolQueryFields = `{
    id
    feeTier
    totalValueLockedUSD
    totalValueLockedETH
    token0Price
    token1Price  
    token0 {
      id
      symbol
      name
      decimals
    }
    token1 {
      id
      symbol
      name
      decimals
    }
    poolDayData(orderBy: date, orderDirection:desc,first:1)
    {
      date
      volumeUSD
      tvlUSD
      feesUSD
      liquidity
      high
      low
      volumeToken0
      volumeToken1
      close
      open
    }
  }`

  const query =  `query Pools($id: ID!) { id: pools(where: { id: $id } orderBy:totalValueLockedETH, orderDirection:desc) 
   ${poolQueryFields}
  }`

  try {

    const response = await fetch(url, requestBody({query: query, variables: {id: id}}));
    const data = await response.json();

    if (data && data.data) {
      const pools = data.data;
 
      if (pools.id && pools.id.length && pools.id.length === 1) {
        return pools.id[0]
      }
    }
    else {
      return null;
    }

  } catch (error) {
    return {error: error};
  }

}
