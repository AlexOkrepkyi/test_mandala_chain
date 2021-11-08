# test_mandala_chain

Source: https://github.com/AcalaNetwork/txwrapper/blob/master/examples/README.md

**txwrapper**:

Here's a mini-tutorial on how txwrapper-acala can interact with a Substrate chain. We're using a Acala dev chain.

Get Started
Build and run a Acala dev node. One way to do that is throguh Docker.

1. To install Docker on Linux:
wget -qO- https://get.docker.com/ | sh

2. After install Docker, pull the latest acala node image and start the dev container. Be sure to externalize RPC and WS with the --ws-external and --rpc-external flags respectively.
 docker pull acala/acala-node:latest
 docker run -it -p 9944:9944 -p 9933:9933 acala/acala-node:latest --dev --ws-external --rpc-external --rpc-cors=all
 
 **sidecar**:

Source: https://github.com/paritytech/substrate-api-sidecar

1. Install the service globally:
npm install -g @substrate/api-sidecar

2. Run the service from any directory on your machine:
substrate-api-sidecar
