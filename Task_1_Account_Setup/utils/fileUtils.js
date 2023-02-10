import fs from "fs";

export const createFile = async (fileName, data) => {
    try {
      const exists = await fileExists(fileName);
      if (!exists) {
        await fs.promises.writeFile(fileName, JSON.stringify(data, null, 2));
        console.log(`\nFile created: ${fileName}`);
      } else {
        console.log(`\nFile already exists: ${fileName}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

export const fileExists = async (fileName) => {
    try {
      await fs.promises.stat(fileName);
      return true;
    } catch (err) {
      return false;
    }
  };
