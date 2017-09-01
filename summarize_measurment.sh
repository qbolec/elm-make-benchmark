#!/bin/bash
file=$1
for measure in {user,sys,real};
do
    echo $file $measure;
    echo "Minimum: " `grep $measure $file | awk '{print $2}' | sort -n | awk 'NR == 1'`;
    echo "Median:  " `grep $measure $file | awk '{print $2}' | sort -n | awk '(NR == 5 || NR == 6) {sum+=$1} END {print sum/2}'`;
    echo "Avarage: " `grep $measure $file | awk '{sum+=$2} END {print sum/10}'`;
    echo "Maximum: " `grep $measure $file | awk '{print $2}' | sort -n | awk 'NR == 10'`;
done;
