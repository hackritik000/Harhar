declare module "astro:actions" {
	type Actions = typeof import("D:/New folder/Harhar/src/actions")["server"];

	export const actions: Actions;
}