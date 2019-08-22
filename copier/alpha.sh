#!/usr/bin/env bash

debug=$1

list=(A B C D E F G H I J K L M N O P Q R S T U V W X Y Z)

for item in ${list[*]}; do
	mkdir ./$item
done

for item in ${list[*]}; do
	if [ -n "$debug" ]; then
		find . -maxdepth 1 -iname "$item*" -type f -exec echo "mv \"{}\" ./$item/" \;
	else
		find . -maxdepth 1 -iname "$item*" -type f -exec mv "{}" ./$item/ \;
	fi
done
