#!/usr/bin/env node
const commander = require("commander");
const fse = require("fs-extra");
const fs = require("fs");
// const { exec } = require("child_process");
const { promises: { readdir } } = require('fs');
const delay = require('delay');

var getDirectories = [];
const util = require('util');
const spawn = require('await-spawn')
// const exec = util.promisify(require('child_process').exec);
// const promise = exec('cd app/ && yarn androidRelease');
// const child = promise.child; 

// Setup command line interface
commander
  .version("0.0.1")
  .name("smartfun-externalization")
  .option("-b, --build <build>", "(Required) debug or release build.")
  .option("-c, --client <client>", "(Required) client specific directory name.")
  .option("-os, --opsys <opsys>", "Execute/ios android build command");

commander.parse(process.argv);

(async () => {
  try {
    const options = commander.opts();
    const { build, client, opsys } = options;

    if (!build || (build && !["debug", "release"].includes(build))) {
      throw Error("Provide a valid build");
    }
    let buildFolderName = "release";
    if (build === "debug") {
      buildFolderName = "debug";
    }

    if (opsys && !["android", "ios"].includes(opsys)) {
      throw Error("Provide a valid os to generate the build");
    }

    if (opsys && build === "release" && opsys === "ios") {
      throw Error("IOS Release build is not externalized");
    }

    if (!client) {
      throw Error("Client directory name is required");
    }
    else if (client === "all") {

      let source = `./assets`

      getDirectories = (await readdir(source, { withFileTypes: true }))
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)






    }
    else {
      const clientExists = await fse.pathExists(`./assets/${client}`);
      if (!clientExists) {
        throw Error("Provide a valid Client directory name");
      }
      else {
        getDirectories.push(client)
      }

      // console.log(getDirectories)

    }
    const commonConfigPath = `./assets/commonConfig.json`;

    for (const client of getDirectories) {
      // console.log("for loop executed  ##############")


      const parafaitConfigPath = `./assets/${client}/parafait.config.json`;
      const configFileData = fs.readFileSync(`${parafaitConfigPath}`);
      const commonConfigData = fs.readFileSync(`${commonConfigPath}`);
      //const commonConfigFileData= fs.readFileSync(`${commonConfigPath}`);
      // console.log("config file read  from the sync ", configFileData)

      //Reading config file
      const parafaitConfigObj = JSON.parse(configFileData);
      const commonConfigObj = JSON.parse(commonConfigData);
      //console.log("config file read  from the sync  ***********", commonConfigObj);
      const versionCode = commonConfigObj.VERSION_CODE + 1;   //parafaitConfigObj.VERSION_CODE + 1;
      parafaitConfigObj.VERSION_CODE = versionCode;
      commonConfigObj.VERSION_CODE = versionCode;

      fs.writeFileSync(
        parafaitConfigPath,
        JSON.stringify(parafaitConfigObj, null, "\t"),
        "utf8"
      );
      //console.log("config file read  from the sync  ***********", commonConfigObj);
      fs.writeFileSync(
        commonConfigPath,
        JSON.stringify(commonConfigObj, null, "\t"),
        "utf8"
      );


      // let versionCode = parafaitConfigObj.VERSION_CODE + 1;
      // parafaitConfigObj.VERSION_CODE = versionCode;
      // fs.writeFileSync(commonConfigFileData,JSON.stringify(parafaitConfigObj,null,"\t"));

      // moving parafait.config.json to app folder
      await fse.copy(parafaitConfigPath, `./app/parafait.config.json`);
      //console.log("parafait.config.json file replaced");

      //moving images strings and other assets to assets/data folfer
      const assetsDataPath = `./assets/${client}/js_assets_data`;
      await fse.copy(assetsDataPath, `./app/src/assets/data`);
      //console.log("assets replaced");

      //updating to gradle.properties file
      const gradlePropertiesPath = "./app/android/gradle.properties";
      var gradlePropertiesData = fs.readFileSync(gradlePropertiesPath, "utf8");
      gradlePropertiesData = gradlePropertiesData.replace(
        /(MYAPP_UPLOAD_STORE_FILE=).+/g,
        `MYAPP_UPLOAD_STORE_FILE=${parafaitConfigObj.MYAPP_RELEASE_STORE_FILE}`
      );
      gradlePropertiesData = gradlePropertiesData.replace(
        /(MYAPP_UPLOAD_KEY_ALIAS=).+/g,
        `MYAPP_UPLOAD_KEY_ALIAS=${parafaitConfigObj.MYAPP_RELEASE_KEY_ALIAS}`
      );
      gradlePropertiesData = gradlePropertiesData.replace(
        /(MYAPP_UPLOAD_STORE_PASSWORD=).+/g,
        `MYAPP_UPLOAD_STORE_PASSWORD=${parafaitConfigObj.MYAPP_RELEASE_STORE_PASSWORD}`
      );
      gradlePropertiesData = gradlePropertiesData.replace(
        /(MYAPP_UPLOAD_KEY_PASSWORD=).+/g,
        `MYAPP_UPLOAD_KEY_PASSWORD=${parafaitConfigObj.MYAPP_RELEASE_KEY_PASSWORD}`
      );

      fs.writeFileSync(gradlePropertiesPath, gradlePropertiesData, "utf8");
      //console.log("gradle.Properties Updated");

      //Moving release keystore file
      const keyStoreFilePath = `./assets/${client}/android/${parafaitConfigObj.MYAPP_RELEASE_STORE_FILE}`;
      await fse.copy(
        keyStoreFilePath,
        `./app/android/app/${parafaitConfigObj.MYAPP_RELEASE_STORE_FILE}`
      );
      // console.log("keystore file Replaced");

      // updating appId,version code, version name in app/build.gradle file
      const buildGradlePath = "./app/android/app/build.gradle";
      var buildGradleData = fs.readFileSync(buildGradlePath, "utf8");
      buildGradleData = buildGradleData.replace(
        /(applicationId ").+/g,
        `applicationId "${parafaitConfigObj.APP_ID}"`
      );

      buildGradleData = buildGradleData.replace(
        /(versionCode ).+/g,
        `versionCode ${versionCode}`
      );

      buildGradleData = buildGradleData.replace(
        /(versionName ").+/g,
        `versionName "${parafaitConfigObj.VERSION_NAME}"`
      );
      //console.log("build grdlae data ",)
      fs.writeFileSync(buildGradlePath, buildGradleData, "utf8");


      //Moving release google-services.jsom file
      const googleServicesFilePath = `./assets/${client}/android/google-services.json`;
      await fse.copy(
        googleServicesFilePath,
        `./app/android/app/src/${buildFolderName}/google-services.json`
      );
      //console.log("google-services.json file Replaced");

      //moving appIcon and other res files to android/app/src/{build}/res folder
      const androidResPath = `./assets/${client}/android/res`;
      await fse.copy(
        androidResPath,
        `./app/android/app/src/${buildFolderName}/res`
      );
      //console.log("res folder replaced");

      //console.log(`Externalization for ${client} is complete`);


      if (opsys) {
        if (opsys === "android" && build === "release") {
          await delay(10000);

          try {



            let bl = await spawn('cd app/ && yarn androidRelease', {
              shell: true,
              stdio: 'inherit'
            });
            //  console.log(bl.toString())
          } catch (e) {
            //   console.log(e.stderr.toString())
          }




        } else if (opsys === "android" && build === "release") {
          const child = exec("cd app/ && yarn androidRelease");
          // and unref() somehow disentangles the child's event loop from the parent's:
          child.unref();
          child.stdout.on("data", function (data) {

          });
        } else if (opsys === "ios" && build === "debug") {
          child = require("child_process").exec("cd app/ && yarn ios");
          // and unref() somehow disentangles the child's event loop from the parent's:
          child.unref();
          child.stdout.on("data", function (data) {
            // console.log("child process executed sucess full ")
            // console.log(data.toString());
          });
        }
      }
    }

    // process.exit(0);
  } catch (error) {
    console.error(
      JSON.stringify(
        {
          status: "error",
          message: error.message || error.toString(),
          data: error.data || error,
        },
        null,
        2
      )
    );

    process.exit(2);
  }
})();
