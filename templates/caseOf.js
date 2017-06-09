function nextName(moduleName, flag) {
    return moduleName + (flag ? 'B' : 'A');
}

function nodeModule(moduleName) {
    const a = nextName(moduleName, false);
    const b = nextName(moduleName, true);
    const lowerA = a.toLowerCase();
    const lowerB = b.toLowerCase();
    return (
`module ${ moduleName } (..) where

import ${ a }
import ${ b }

type ${ moduleName }
  = X ${ a }.${ a }
  | Y ${ b }.${ b }

${ moduleName.toLowerCase() } argument =
  case argument of
    X x -> ${ a }.${ lowerA } x
    Y y -> ${ b }.${ lowerB } y
`);
}

function leafModule(moduleName) {
    return (
`module ${ moduleName } (..) where

type ${ moduleName }
  = X String
  | Y Int
  

${ moduleName.toLowerCase() } argument =
  case argument of
    X x -> x
    Y y -> toString y
`);
}

const mainModule =
`module Main (..) where

import Html exposing (text)
import A
import B

ab argument =
  case argument of
    Just (a, b) -> A.a a ++ B.b b
    Nothing -> "Nothing"
    
main =
  text (ab Nothing)
`;

module.exports = {
    nodeModule,
    leafModule,
    mainModule
};