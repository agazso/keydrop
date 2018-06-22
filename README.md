## Keydrop

### Building Keydrop

You will need to build the Keydrop Go library (https://github.com/helmethair-co/keydrop-go) and copying the android and iOS libraries before building Keydrop. See the documentation how to do that in that repository.

Once you have the Keydrop Go library built, it means that you can build the Keydrop application with Swarm/PSS enabled on mobile. The PSS interface is exposed through RPC over Websocket running on the phone at port `8546`.


### Running with the debugger

`REACT_DEBUGGER="node node_modules/react-native-debugger-open/bin/rndebugger-open.js --open --port 8081" react-native start --verbose --resetCache`
