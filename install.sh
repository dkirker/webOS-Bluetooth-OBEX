#!/bin/bash

APP_NAME="BT OPP"
APP_ID="com.palm.app.btopp"
SRV_ID="com.palm.app.btopp.service"

STAGING="staging/"
#METRIX="MetrixLibrary/"

#if [ ! -d ${METRIX} ]; then
#    echo "Please download the Metrix libraries and extract into ./MetrixLibrary"
#    exit
#fi;

echo "**** Cleaning ${APP_NAME}"

rm ${APP_ID}*.ipk

if [ ! -d ${STAGING} ]; then
    mkdir ${STAGING}
else
    rm -rf ${STAGING}
    mkdir ${STAGING}
fi;

echo "**** Staging ${APP_NAME}"

cp -R ${APP_ID} ${STAGING}
cp -R ${SRV_ID} ${STAGING}
cp -R package ${STAGING}
cp pmPostInstall.script ${STAGING}
cp pmPreRemove.script ${STAGING}

#echo "**** Staging Metrix"

#cp -R ${METRIX}images ${STAGING}
#cp ${METRIX}app/models/metrix.js ${STAGING}app/models/
#cp ${METRIX}app/models/metrixCore.js ${STAGING}app/models/
#cp ${METRIX}app/models/asyncWrappers.js ${STAGING}app/models/
#cp -R ${METRIX}app/views/metrix ${STAGING}app/views/

echo "**** Packaging ${APP_NAME}"

palm-package ${STAGING}/${APP_ID} ${STAGING}/package ${STAGING}/${SRV_ID}
ar q ${APP_ID}_*.ipk ${STAGING}/pmPostInstall.script
ar q ${APP_ID}_*.ipk ${STAGING}/pmPreRemove.script

echo "**** Installing ${APP_NAME}"

palm-install ${APP_ID}_*
