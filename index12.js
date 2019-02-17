/* Sample output
object key in x 42,264,790 ops/sec ±0.27% (90 runs sampled)
set has x 84,585,887 ops/sec ±0.36% (93 runs sampled)
Fastest is set has
*/
const Benchmark = require('benchmark');

const suite = new Benchmark.Suite();

const oHashes = {
  zQmXvN3mJry2mE3jyuTvSTViFsQd4wpnhmpQSp1QAjmZSMB: true,
  zQmWickrN8aG6hAZHFA7CDnNM8FdgCvVLgWFomR2x8a1sJj: true,
  zQmXFsSfQRdRGNsRNG5oKjaXFhQjk4VN2ZJMyzw1nDcMz9t: true,
  zQmVe6znSKRByDQ21gnPsQH6JbNxygn9vFH8dyc1j5yGRzK: true,
  zQmcQw9TGWWEez6oiQ2mZVcvyLYdJWS1U28C4v6a3C2T7ER: true,
  zQmVh4BZNGbs5i3s9DwW2V3CEjRWLTsV8RVgWPz8HLCKGPx: true,
  zQmZHeUWPXjMePMpE7ey588vMHQ6E8W6Uq7cCNitjJ3j5qp: true,
  zQmVYjRcf6xjCR8zDcbVfhodYbRjKrcHjDxLS5UDLLru2rK: true,
  zQmPNkhA5RU2u4KCCAVP9qyEgZ2mnS8wk9hr7CzkqZHatrr: true,
  zQmZzvteTtQju6APZRxQjK9xRgYr9sD9mNrzYbre2RKus8S: true,
  zQmdxyaT32fqDJAs7CyDKgYXvFcJ2vobWkBhaWUkfYsTESv: true,
  zQmaNL4xLCdhbmAyQ4YrXBfeX37Gdy4wS357ysLryh6PmGz: true,
  zQmSBq6sXemhUaYTkULTUWvmM4x1taKrivmhihsbyvpFBgd: true,
  zQmbgHL2NjTdbYJLFYwbRdHGrTuoJt5BvvXvUSbtG6sv8Uc: true,
  zQmNPHK26tKxmwC9bAs8CFBUArcet5RwaHcde2NjKRnbkUH: true,
  zQmXggoRozYGm6CLExFMyeBHM1buzc7BFakuFuBvSBcb6QL: true,
  zQmazEBxdLBYhWFpTsDXfzXH2a3L5rdWrstabXtduRHLQ7n: true,
  zQmfGopMC7r6XuiPA1ryW7sLGW65W2pe1E91XXMbikCfgUW: true,
  zQmUfTyUoLxAuQiNbojUjwHZHHi1fPFCEVs3bViT3M7iF2Y: true,
  zQmRAiRrQpBUBZQrkvvN4raURnvh6FSgiUCBSyL4ZxZYqTL: true,
  zQma41sZB9EDnMe4rZzx6ijBdUzDRytH54Ncpwz1JhxGFE5: true,
  zQmZfGQfKboVyGyKr7UG2ZFLYJo7bhi16Nv4rNCRUGpQ4R5: true,
  zQmezRUQyfeFHDQxvyResgQ6mVTASVQGQgGjLDEz1198WC4: true,
  zQmPCjgQJNrP8NizrfAjy71ntJDSj3MT33v5uKVr9krNTKS: true,
  zQmXhKnXjXSd1tvPkjZqpuB7S53FHpT42uYjW5Q9K5U5pYX: true,
  zQmTc1U1XAq6kZjRoQ3ZDgck3ANevZYxpM7XCSsUHguef2u: true,
  zQmYyuMy1eoUV9md553MK53r6KVNwNRKyCRTD9fgyU8D7eP: true,
  zQmTZFMnvyx6jPmr3zyEPorHFr9xdADV7qo8aNwYLYWBW1Q: true,
  zQmWhGS1bcHv7W2c9ZzcVHFeuzyhu5p57APvQoTicfk7qVR: true,
  zQmeAi9ChZTebUqrukcU9abWM577SdxS9CGZnbaSGwvXe66: true,
  zQmd4D9yMQmvq27DYcBqkP3pugcqzg91gYXnwfgHsibzpUe: true,
  zQmTLyP4NtrTTrks4UfU8jBmVUUPysdANDgywR5Sb8JHmvi: true,
  zQmNq9KAzBNSk8SRb18ojrjFjPtjvrata6KtQCQW6SLqJbR: true,
  zQmYMvGnx4dvCQiuNhDGdk2kBet39isWgwYA4Jn1JEMRwaz: true,
  zQmYyKxWzKqAmZ9BG3NRJG11yjf3d76t5Xea1KVUcZQEZh9: true,
  zQmSC8jtt193xNx13MxkRxTJG6o9raxj8hjnZvJ5WgasmYV: true,
  zQmPgDYpJnsbLCFZHP3tTrGRa6tbE6ntzNacSnfX1GGa6Ux: true,
  zQmQhrV18SiefRG1SVpkzQM2sptEyBpb5fMbAEhnSu3ExHW: true,
  zQmU2dUx9Y6CQPk29WuvJi3tWZ37EQGp5f5mPcAhs7F85MT: true,
  zQmeQis9anUatGzHeDXHspX8HYF2MEQgS6Hv4xvhazNzZQn: true,
  zQmfGSdpMZyfHNMnoKcwF9n5jFy2J6aJ7hhnNTXbGL1H8qd: true,
  zQmaA3TsadetJ5qwcoZWebeJejLn3VtMuACSh2ggp2k2iDK: true,
  zQmeJSapEnqvht3qj4uNdRND4yEyxP5qWN8jUz86PAUfTmq: true,
  zQmb4bUgKPQfSg2WC3xTwCrKuemqZkhN8YWfUy5ojqaFXK9: true,
  zQmaeweEfDk5Nb1yDf5wn4Q8K1MYxdh3JF1TP3odzq6HNBq: true,
  zQmd7grqEWCRwdo8o9166tdJJPzWLZhyFuMFwPt5G1vr4Gi: true,
  zQmV47NtkkuLP8Ehbe4yhsh7PWB2kjUeddhhXnrSx3rN18A: true,
  zQmUSKdyBvWkPNX6Wab1eBG7q1pCYH45Pv3c7Z9mjyRwxKn: true,
  zQmWoYZ44rv7DvxjZCpN8AoGNa2Ar5QRxp3HHyN6t2oDMgJ: true,
  zQmdpUnztEsiqkYvnNxBb2QpbDKAnbpFVRQS7rhYXABZhfE: true,
  zQmTWNY94kQ6UkLudDpVCuXxmrkP32J5hHCTbRGA3XrT3zT: true,
  zQmQ1oNwddo9uTUjNkyBQC2fyX4sSx6C7or2JzZBqZfD9ST: true,
  zQmXG9g9E2woBBDDs1By2v16aUHVGmLfgwk6dC37FuBTsnW: true,
  zQmRgdHZJoyY44wkWsRYqTZ3izyePYtX8Tp6rR7rdT2nbo8: true,
  zQmZ559DR3ZRkumTLawD9S9cLMe9BgBwfvUXBEwWnZHPWsw: true,
  zQmaoUbJXyQiYgMtMnKxRJJYqNbHErL1jziZUyhbpFePw7K: true
};

const setHashes = new Set(Object.keys(oHashes));

// object in
function loop1() {
  if('zQmXvN3mJry2mE3jyuTvSTViFsQd4wpnhmpQSp1QAjmZSMB' in oHashes) {
    // do nothing
  }
}

// set has
function loop2() {
  if(setHashes.has('zQmXvN3mJry2mE3jyuTvSTViFsQd4wpnhmpQSp1QAjmZSMB')) {
    // do nothing
  }
}

suite
  .add('object key in', () => loop1())
  .add('set has', () => loop2())
  .on('cycle', event => {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();
