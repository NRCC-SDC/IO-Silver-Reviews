// file of helper functions for artillery testing

module.exports = {
  randomProductId,


}

function randomProductId(context, ee, next) {
  context.vars.productId = random(1, 1000000);
  return next();
}

// helper functions
// generate random number between start and end inclusive
function random(start, end) {
  // not truly random, somewhat biased
  return start + Math.floor(Math.random() * (end - start + 1));
};