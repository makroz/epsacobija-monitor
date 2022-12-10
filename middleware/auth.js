export default async function(ctx) {
    ctx.store.commit("auth/setRutaBack", ctx.route.fullPath);
    const user = await ctx.store.dispatch('auth/getUser');
    if (!user || !user.id) {
        ctx.redirect("/login/")
        return false
    }
    ctx.$axios.defaults.headers.common["Authorization"] =
        ctx.store.getters["auth/getToken"];
}