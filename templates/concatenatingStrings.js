function nextName(moduleName, flag) {
    return moduleName + (flag ? 'B' : 'A');
}

function nodeModule(moduleName) {
    const a = nextName(moduleName, false);
    const b = nextName(moduleName, true);
    return (
`module ${ moduleName } (..) where

import ${ a } exposing (..)
import ${ b } exposing (..)

${ moduleName.toLowerCase() } = ${ a.toLowerCase() } ++ ${ b.toLowerCase() } 
`);
}

function leafModule(moduleName) {
    return (
`module ${ moduleName } (..) where

${ moduleName.toLowerCase() } = ${ JSON.stringify(moduleName) } 
`);
}

const mainModule =
`module Main (..) where

import Html exposing (text)
import A
import B
main =
  text (A.a ++ B.b)
`;

module.exports = {
    nodeModule,
    leafModule,
    mainModule
};