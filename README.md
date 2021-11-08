# test_mandala_chain

To run tests locally, we need test node (e.g., Acala) & Sidecar API.
-----

**txwrapper-acala**:

Source: https://github.com/AcalaNetwork/txwrapper/blob/master/examples/README.md

Here's a mini-tutorial on how txwrapper-acala can interact with a Substrate chain. I am using an Acala dev chain.

1. Install Docker on Linux:
```
wget -qO- https://get.docker.com/ | sh
```
2. After Docker installation, pull the latest Acala node image and start the dev container. Make sure to externalize RPC and WS with the --ws-external and --rpc-external flags respectively.
```
 docker pull acala/acala-node:latest
 docker run -it -p 9944:9944 -p 9933:9933 acala/acala-node:latest --dev --ws-external --rpc-external --rpc-cors=all
```
-----

 **sidecar**:

Source: https://github.com/paritytech/substrate-api-sidecar

1. Install the service globally:
```
npm install -g @substrate/api-sidecar
```
2. Run the service from any directory on your machine:
```
substrate-api-sidecar
```
