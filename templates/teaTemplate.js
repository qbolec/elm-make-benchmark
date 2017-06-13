function nextName(moduleName, flag) {
    return moduleName + (flag ? 'B' : 'A');
}

function nodeModule(moduleName) {
    const a = nextName(moduleName, false);
    const b = nextName(moduleName, true);
    return (
        `module ${ moduleName } (..) where

import ${ a }
import ${ b }
import Effects exposing (Effects)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import String

type alias State =
    { aTree : ${ a }.State
    , bTree : ${ a }.State
    , counter : Int
    , label : String
    , showATree : Bool
    , showBTree : Bool
    }


initialState : State
initialState =
  { aTree = ${ a }.initialState
  , bTree = ${ b }.initialState
  , counter = 0
  , label = ""
  , showATree = False
  , showBTree = False
  }


type Action
  = NoOp
  | IncrementCounter
  | DecrementCounter
  | SetCounter String
  | SetLabel String
  | DuplicateLabel
  | AAction ${ a }.Action
  | BAction ${ b }.Action
  | ToggleA
  | ToggleB


update : Action -> State -> (State, Effects Action)
update action model =
  case action of
    NoOp -> ( model, Effects.none )
    IncrementCounter -> model.counter + 1 |> toString |> SetCounter |> update |> (\\u -> u model)
    DecrementCounter -> model.counter - 1 |> toString |> SetCounter |> update |> (\\u -> u model)
    SetCounter value -> ( { model | counter = value |> String.toInt |> Result.withDefault 0 }, Effects.none )
    SetLabel value -> ( { model | label = value }, Effects.none )
    DuplicateLabel -> model.label ++ model.label |> SetLabel |> update |> (\\u -> u model)
    AAction aAction ->
      let
        ( newAModel, effects ) = ${ a }.update aAction model.aTree
      in
        ( { model | aTree = newAModel }, effects |> Effects.map AAction )
    BAction bAction ->
      let
        ( newBModel, effects ) = ${ b }.update bAction model.bTree
      in
        ( { model | bTree = newBModel }, effects |> Effects.map BAction )
    ToggleA -> ( { model | showATree = not model.showATree }, Effects.none )
    ToggleB -> ( { model | showBTree = not model.showBTree }, Effects.none )


view : Signal.Address Action -> State -> Html
view address model =
  let
    aTree =
      if model.showATree then
        ${ a }.view (Signal.forwardTo address AAction) model.aTree
      else
        text ""

    bTree =
      if model.showBTree then
        ${ b }.view (Signal.forwardTo address BAction) model.bTree
      else
        text ""
  in
    div
      []
      [ h2 [] [ text "${ moduleName }"]
      , div
          []
          [ text "label: "
          , input
              [ on "input" targetValue (SetLabel >> Signal.message address)
              , type' "text"
              , value model.label
              ]
              []
          , button [ onClick address DuplicateLabel ] [ text "x2" ]
          ]
      , div
          []
          [ text "counter: "
          , input
              [ on "input" targetValue (SetCounter >> Signal.message address)
              , type' "text"
              , model.counter |> toString |> value 
              ]
              []
          , button [ onClick address IncrementCounter ] [ text "+" ]
          , button [ onClick address DecrementCounter ] [ text "-" ]
          ]
      , aTree
      , bTree
      ]
`);
}

function leafModule(moduleName) {
    return (
        `module ${ moduleName } (..) where

import Effects exposing (Effects)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import String

type alias State =
    { counter : Int
    , label : String
    }


initialState =
  { counter = 0
  , label = ""
  }


type Action
  = NoOp
  | IncrementCounter
  | DecrementCounter
  | SetCounter String
  | SetLabel String
  | DuplicateLabel


update : Action -> State -> (State, Effects Action)
update action model =
  case action of
    NoOp -> ( model, Effects.none )
    IncrementCounter -> model.counter + 1 |> toString |> SetCounter |> update |> (\\u -> u model)
    DecrementCounter -> model.counter - 1 |> toString |> SetCounter |> update |> (\\u -> u model)
    SetCounter value -> ( { model | counter = value |> String.toInt |> Result.withDefault 0 }, Effects.none )
    SetLabel value -> ( { model | label = value }, Effects.none )
    DuplicateLabel -> model.label ++ model.label |> SetLabel |> update |> (\\u -> u model)


view : Signal.Address Action -> State -> Html
view address model =
    div
      []
      [ h2 [] [ text "${ moduleName }"]
      , div
          []
          [ text "label: "
          , input
              [ on "input" targetValue (SetLabel >> Signal.message address)
              , type' "text"
              , value model.label
              ]
              []
          , button [ onClick address DuplicateLabel ] [ text "x2" ]
          ]
      , div
          []
          [ text "counter: "
          , input
              [ on "input" targetValue (SetCounter >> Signal.message address)
              , type' "text"
              , model.counter |> toString |> value 
              ]
              []
          , button [ onClick address IncrementCounter ] [ text "+" ]
          , button [ onClick address DecrementCounter ] [ text "-" ]
          ]
      ]
`);
}

const mainModule =
    `module Main (..) where

import Html exposing (text)
import A
import B
import StartApp exposing (start)
import Effects exposing (Effects)
import Html exposing (..)


type alias State =
    { aTree : A.State
    , bTree : B.State
    }


initialState =
  { aTree = A.initialState
  , bTree = B.initialState
  }


type Action
  = NoOp
  | AAction A.Action
  | BAction B.Action


update : Action -> State -> (State, Effects Action)
update action model =
  case action of
    NoOp -> ( model, Effects.none )
    AAction aAction ->
      let
        ( newAModel, effects ) = A.update aAction model.aTree
      in
        ( { model | aTree = newAModel }, effects |> Effects.map AAction )
    BAction bAction ->
      let
        ( newBModel, effects ) = B.update bAction model.bTree
      in
        ( { model | bTree = newBModel }, effects |> Effects.map BAction )


view : Signal.Address Action -> State -> Html
view address model =
  let
    aTree =
      A.view (Signal.forwardTo address AAction) model.aTree

    bTree =
      B.view (Signal.forwardTo address BAction) model.bTree
  in
    div
      []
      [ aTree
      , bTree
      ]

app : StartApp.App State
app =
  start
    { init = ( initialState, Effects.none )
    , view = view
    , update = update
    , inputs = []
    }


main : Signal Html
main =
  app.html
`;

module.exports = {
    nodeModule,
    leafModule,
    mainModule
};