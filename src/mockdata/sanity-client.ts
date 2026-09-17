export const createClient = () => {
    return {
        listen: () => {
            return {
                subscribe: () => ({
                    unsubscribe: () => {}
                })
            }
        }
    }
}
