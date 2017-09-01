#!/bin/bash
DEPTH=8;
for TEMPLATE in {caseOf,concatenatingStrings,teaTemplate};
do
    for((t=10;t--;));
    do
        DEPTH=$DEPTH TEMPLATE=$TEMPLATE npm run measure > /dev/null;
    done 2> ./results/depth-$DEPTH.template-$TEMPLATE.txt
done;
