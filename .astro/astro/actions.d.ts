declare module "astro:actions" {
	type Actions = typeof import("/home/ritikparihar/Project/Harhar/src/actions")["server"];

	export const actions: Actions;
}