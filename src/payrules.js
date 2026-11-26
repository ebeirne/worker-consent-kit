// New York City Fast Food Fair Workweek extra pay (premiums), as described in the city's FAQ.
// tier(): days from the day the worker is told to the first day of the posted schedule week.
// owed(kind, firstDayOfWeek, toldDate, isOvertime, isEmergency) -> dollars of extra pay.
// kind: cover | late | extra | move | cut | clopen | asked | trade
// A guide, not legal advice.
function tier(first,told){var d=Math.round((Date.parse(first+"T00:00:00Z")-Date.parse(told+"T00:00:00Z"))/86400000);return d>14?0:d>7?1:d>1?2:3}
function owed(kind,first,told,ot,em){
  if(kind==="asked"||kind==="trade")return 0;
  if(kind==="clopen")return 100;
  if(em)return 0;
  var t=tier(first,told);
  if(kind==="cut")return [0,20,45,75][t];
  if(ot&&kind!=="move")return 0;
  return [0,10,15,15][t];
}

module.exports = { tier, owed };
