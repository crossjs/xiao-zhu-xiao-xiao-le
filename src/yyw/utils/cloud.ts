namespace yyw {
  wx.cloud.init({
    env: CLOUD_ENV,
    traceUser: true,
  });

  export const cloud = {
    async call(name: string, data?: any): Promise<any> {
      const { result } = await wx.cloud.callFunction({
        // 要调用的云函数名称
        name,
        // 传递给云函数的参数
        data,
      });
      return result;
    },

    async read(fileID: string): Promise<any> {
      return cloud.call("readFile", {
        fileID: `${CLOUD_DIR}/${fileID}`,
      });
    },

    async getTempFileURL(fileIDs: string[]): Promise<any[]> {
      const { fileList } = await wx.cloud.getTempFileURL({
        fileList: fileIDs.map((fileID: string) => `${CLOUD_DIR}/${fileID}`),
      });
      const fileMap = arr2obj(fileList, "fileID");
      return fileIDs.map((fileID) => {
        const file = fileMap[fileID];
        return file && file.status === 0 && file.tempFileURL || "";
      });
    },
  };
}
