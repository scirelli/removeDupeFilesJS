#!/usr/bin/env bash

srcDir=${1:-'.'}
dstDir=${2:-'/tmp'}
debug=${3:-''}

# Example
#                 src               dst    debug
# ./sortDir.sh ./DVDs_Not_Burned ./DVDs

list=(A B C D E F G H I J K L M N O P Q R S T U V W X Y Z)

for item in ${list[*]}; do
	if [ -n "$debug" ]; then
		echo mkdir -p "$dstDir/$item"
	else
		mkdir -p "$dstDir/$item"
	fi
done

for item in ${list[*]}; do
	if [ -n "$debug" ]; then
		set -x
		find "$srcDir" -mindepth 1 -maxdepth 1 -iname "$item*" -type d -exec echo mv "\"{}\"" "\"$dstDir/$item/\"" \;
		set +x
	else
		find "$srcDir" -mindepth 1 -maxdepth 1 -iname "$item*" -type d -exec mv "{}" "$dstDir/$item/" \;
	fi
done
