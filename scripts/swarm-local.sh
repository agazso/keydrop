#!/bin/sh -ex
#
# This script starts a swarm server for testing. You have to specify the datadir,
# the websocket ip and port and you can specify other swarm arguments.
#
# In this script the discovery is disabled with the --nodiscover flag
# If you want to start more than one node, you will need to specify the port with
# the --port flag, and the default value is 30399, so you need to use a different value.
# (e.g. --port 30400)

if [ "$1" = "" ]; then
    echo "Usage: swarm-local.sh <datadir> <websocket-ip-address> <websocket-port> <other-swarm-arguments>"
    exit 1
fi

DATADIR=$1
shift
WSADDR=$1
shift
WSPORT=$1
shift

BZZ_ADDRESS=$(cat $DATADIR/keystore/* | jq -r .address)

swarm --verbosity 3 --bzzaccount $BZZ_ADDRESS --ws --wsaddr $WSADDR --wsport $WSPORT --wsorigins http://$WSADDR:$WSPORT --nodiscover --datadir $DATADIR --vmodule=swarm/pss=6 $*

