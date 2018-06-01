#!/bin/sh -ex
#
# This script starts a swarm server for testing. You have to specify the datadir,
# the websocket ip and port and you can specify other swarm arguments.
#
# This script will connect to a bootnode and then with discover it will find other nodes.

if [ "$1" = "" ]; then
    echo "Usage: swarm-testnet.sh <datadir> <websocket-ip-address> <websocket-port> <other-swarm-arguments>"
    exit 1
fi

DATADIR=$1
shift
WSADDR=$1
shift
WSPORT=$1
shift

BZZ_ADDRESS=$(cat $DATADIR/keystore/* | jq -r .address)
BOOTNODE='enode://867ba5f6ac80bec876454caa80c3d5b64579828bd434a972bd8155060cac36226ba6e4599d955591ebdd1b2670da13cbaba3878928f3cd23c55a4e469a927870@13.79.37.4:30399'

swarm --verbosity 3 --bzzaccount $BZZ_ADDRESS --bootnodes $BOOTNODE --ws --wsaddr $WSADDR --wsport $WSPORT --wsorigins http://$WSADDR:$WSPORT --datadir $DATADIR --vmodule=swarm/pss=6 $*

