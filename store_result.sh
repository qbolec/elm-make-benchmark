#!/bin/bash
x=$1
mkdir results/$x
cp elm-make.hp elm-make.prof results/$x
cd results/$x
samples=`ack BEGIN_SAMPLE elm-make.hp | wc -l`
echo $samples samples
awk -v samples="$samples" 'BEGIN {b=0;e=0;} ($1=="BEGIN_SAMPLE") { b++ } ($1=="END_SAMPLE") {e++ } (b<1 || b> samples - 100)' elm-make.hp > end.hp
hp2ps -c -d end.hp
hp2ps -c < end.hp > end2.ps
hp2ps -c -d elm-make.hp
ack 'total alloc|traverseTerm' elm-make.prof | head -n2 | sed 's/[,.]//g' | awk 'BEGIN {z=1} {z*=$4} END {print z/1000}'