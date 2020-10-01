import React, { useEffect } from "react";

const Test = () => {
  const buildtreeComponents = async () => {
    // Load the AWS SDK for Node.js
    const AWS = require("aws-sdk");
    // Set the region
    AWS.config.update({
      credentials: false,
      region: "us-east-1",
    });

    // Create S3 service object
    const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

    // Create the parameters for calling listObjects
    const bucketParams = {
      Bucket: "fema-ftp-snapshot",
    };

    // Call S3 to obtain a list of the objects in the bucket
    s3.listObjectsV2(bucketParams, function (err, data) {
      if (err) {
        console.error("Error", err);
      } else {
        console.log("Success", data);
      }
    });
  };

  useEffect(() => {
    buildtreeComponents();
  }, []);

  return <div> happy happy joy joy</div>;
};

export default Test;
