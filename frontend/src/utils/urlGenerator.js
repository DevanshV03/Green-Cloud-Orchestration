export const getPingUrl = (regionCode) =>{
    if(!regionCode) return null;

    const regionUrl = `https://dynamodb.${regionCode}.amazonaws.com`;
    return regionUrl;
}