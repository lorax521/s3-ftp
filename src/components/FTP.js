import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import config from "../config.json";

import Button from "@material-ui/core/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { faFile } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles({
  root: {
    color: "white",
    background: "steelblue",
  },
  header: {
    background: "white",
    padding: "0 50px",
    display: "flex",
    flexDirection: "row",
    justifyContent: " space-between",
    color: "#606068",
    boxShadow: "0 0 5px rgba(0,0,0,0.2)",
    fontSize: "14px",
    alignItems: "center",
    marginBottom: "20px",
    "& img": {
      width: "200px",
      height: "auto",
    },
  },
  content: {
    margin: "0 3em 0 3em",
    display: "grid",
  },
  back: {
    color: "#006ea0",
    fontSize: "2rem",
    borderRadius: "50%",
    "&:hover": {
      color: "#00608c",
      boxShadow: "0 0 5px rgba(0,0,0,0.2)",
      cursor: "pointer",
    },
  },
  sectionTitle: {
    textAlign: "left",
  },
  sectionIcon: {
    margin: "0 1em 0 1em",
  },
  list: {
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "1em",
    background: "#f9f9f9",
    borderRadius: "5px",
    boxShadow: "2px 2px 2px #e9e9e9",
  },
  listItem: {
    margin: "5px",
    "&:hover": {
      cursor: "pointer",
      color: "#00568d",
    },
  },
});

const FTP = () => {
  const classes = useStyles();
  const history = useHistory();
  const [treePaths, setTreePaths] = useState({});
  const [treePathCurrent, setTreePathCurrent] = useState({});

  var AWS = require("aws-sdk");
  AWS.config.update({
    accessKeyId: config.akid,
    secretAccessKey: config.sakid,
  });
  const s3 = new AWS.S3();
  const params = {
    Bucket: "fema-ftp-snapshot" /* required */,
    Prefix: "Hazus", // Can be your folder name
  };

  const buildtreeComponents = () => {
    s3.listObjectsV2(params, function (err, data) {
      if (err) console.error(err, err.stack);
      // an error occurred
      else {
        const contents = data.Contents;
        const linkPrefix = "https://fema-ftp-snapshot.s3.amazonaws.com/";
        contents.forEach((path) => {
          let levels = path.Key.split("/");
          let file = levels.pop();

          let prevLevel = treePaths;
          let prevProp = levels.shift();

          levels.forEach((prop) => {
            if (prop.length > 0 && prop !== "undefined") {
              prevLevel[prevProp] = prevLevel[prevProp] || {};
              prevLevel = prevLevel[prevProp];
              prevProp = prop;
            }
          });
          prevLevel[file] = { link: linkPrefix + path.Key };
        });
        console.log("----treepath------");
        console.log(treePaths);
        updateTreePathCurrent();
        history.push("?path=");
      }
    });
  };

  const handleClick = (e) => {
    const target = `${e.target.dataset["key"]}`;
    let link = `${e.target.dataset["link"]}`;
    if (link !== "undefined") {
      link = encodeURI(link);
      window.open(link);
    } else {
      let path = history.location.pathname;
      path = [path, target].join("/");
      path = path.replace("//", "/");
      console.log("----targetlink------");
      console.log(target);
      console.log(link);
      console.log(path);
      history.push(path);
      updateTreePathCurrent();
    }
  };

  const back = () => {
    let path = history.location.pathname;
    console.log("----pathhistory------");
    console.log(path);
    console.log(history);
    path = path.split("/");
    path.pop();
    path = path.join("/");
    console.log(path);
    history.push(path);
    updateTreePathCurrent();
  };

  const updateTreePathCurrent = () => {
    let treeObj = { ...treePaths };
    const pathKeys = history.location.pathname.split("/");
    console.log("updateTREEPATH");
    console.log(pathKeys);
    console.log(treeObj);
    pathKeys.forEach((pathKey) => {
      if (
        Object.keys(treeObj).includes(pathKey) &&
        pathKey.length > 0 &&
        pathKey !== "index.html"
      ) {
        treeObj = treeObj[pathKey];
        console.log("utpc - if");
        console.log(pathKey);
        console.log(treeObj);
      }
    });
    console.log("updateTREEPATH - post");
    console.log(treeObj);
    setTreePathCurrent({ ...treeObj });
  };

  useEffect(() => {
    buildtreeComponents();
  }, []);

  return (
    <div>
      <div className={classes.header}>
        <h1>Natural Hazards Risk Assessment Program - FTP</h1>
        <img
          src="https://fema-nhrap.s3.amazonaws.com/Assets/hazus_icons/Hazus+Logo_Blue.png"
          alt="Hazus"
        />
      </div>
      <div className={classes.content}>
        <FontAwesomeIcon
          className={classes.back}
          onClick={back}
          icon={faArrowCircleLeft}
        />
        <div>
          <h3 className={classes.sectionTitle}>
            Folders
            <FontAwesomeIcon
              icon={faFolder}
              className={classes.sectionIcon}
            />{" "}
          </h3>
          <ul className={classes.list}>
            {Object.keys(treePathCurrent).map((key) => {
              console.log("mapping");
              console.log(treePathCurrent);
              console.log(treePathCurrent[key].link);
              if (treePathCurrent[key].link === undefined) {
                return (
                  <li
                    data-key={key}
                    data-link={treePathCurrent[key].link}
                    onClick={handleClick}
                    className={classes.listItem}
                  >
                    {key}
                  </li>
                );
              }
            })}
          </ul>
        </div>
        <div>
          <h3 className={classes.sectionTitle}>
            Files
            <FontAwesomeIcon icon={faFile} className={classes.sectionIcon} />
          </h3>
          <ul className={classes.list}>
            {Object.keys(treePathCurrent).map((key) => {
              console.log("mapping");
              console.log(treePathCurrent);
              console.log(treePathCurrent[key].link);
              if (treePathCurrent[key].link !== undefined) {
                return (
                  <li
                    data-key={key}
                    data-link={treePathCurrent[key].link}
                    onClick={handleClick}
                    className={classes.listItem}
                  >
                    {key}
                  </li>
                );
              }
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FTP;
