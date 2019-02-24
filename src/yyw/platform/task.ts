namespace yyw {
  export const task = {
    async all(): Promise<any> {
      return request(`${CONFIG.serverOrigin}/api/tasks`);
    },

    async me(): Promise<any> {
      return requestWithAuth(`${CONFIG.serverOrigin}/api/user/tasks`);
    },

    async save(id: string): Promise<any> {
      return requestWithAuth({
        url: `${CONFIG.serverOrigin}/api/user/tasks/${id}`,
        method: "POST",
      });
    },
  };
}
