#!/bin/bash
###
 # @Author: your name
 # @Date: 2021-01-26 11:26:03
 # @LastEditTime: 2021-03-26 17:27:09
 # @LastEditors: Please set LastEditors
 # @Description: In User Settings Edit
 # @FilePath: \frontend\build.sh
###
PWD=$(cd `dirname $0`; pwd)
envCheck(){
    if [ -d "${PWD}/frontend" ]; then
        rm -rf ${PWD}/frontend
    fi
}
npmCheck(){
    npm ls npm-run-all
    if [ $? -ne 0 ]; then
        echo "npm-run-all not install."
        npm install npm-run-all
    fi
}
npmBuild(){
    cd $PWD
    npm config set registry http://r.npm.taobao.org/
    npm run build
}
main(){
    envCheck
    npmCheck
    npmBuild
}
main
