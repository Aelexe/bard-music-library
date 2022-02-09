const fs = require("fs");

/**
 * Returns whether the provided path is a directory and whether and its subdirectories contains no files.
 *
 * @param {string} path Path of the directory to check.
 * @returns {boolean} Whether the directory is empty.
 */
function isEmptyDirectory(path) {
	// Check if the path is a directory.
	if (!fs.lstatSync(path).isDirectory()) {
		return false;
	}

	let childPaths = fs.readdirSync(path);

	// If the directory contains no children it is empty.
	if (childPaths.length === 0) {
		return true;
	}

	childPaths = childPaths.map((name) => {
		return `${path}\\${name}`;
	});

	// Check each non-empty child directory.
	for (const childPath of childPaths) {
		if (!isEmptyDirectory(childPath)) {
			return false;
		}
	}

	return true;
}

module.exports = function (grunt) {
	require("load-grunt-tasks")(grunt);

	grunt.initConfig({
		clean: {
			code: "dist/**/*.{js,js.map}",
			codeBuild: ["dist/**/*.{js,js.map}", "!dist/pages/**/*.js"],
			html: "dist/**/*.{html,php,twig}",
			css: "dist/**/*.css",
			fonts: "dist/fonts/*",
			images: "dist/**/*.{png,jpg,svg,ico}",
			empties: {
				src: "dist/**/*",
				filter: function (path) {
					return isEmptyDirectory(path);
				},
			},
			dist: "dist/**/*",
		},
		copy: {
			code: {
				files: [
					{
						expand: true,
						cwd: "src",
						src: "**/*.{js,json}",
						dest: "dist",
					},
				],
			},
			html: {
				files: [
					{
						expand: true,
						cwd: "src",
						src: ["**/*.{html,php,twig}", "**/.htaccess"],
						dest: "dist",
					},
				],
			},
			css: {
				files: [
					{
						expand: true,
						cwd: "src",
						src: "**/*.css",
						dest: "dist",
					},
				],
			},
			fonts: {
				files: [
					{
						expand: true,
						cwd: "src",
						src: "fonts/**/*",
						dest: "dist",
					},
				],
			},
			images: {
				files: [
					{
						expand: true,
						cwd: "src",
						src: ["**/*.{png,jpg,svg,ico}"],
						dest: "dist",
					},
				],
			},
		},
		uglify: {
			default: {
				files: [
					{
						expand: true,
						cwd: "dist",
						src: "**/*.js",
						dest: "dist",
					},
				],
			},
		},
		ts: {
			default: {
				tsconfig: "./tsconfig.json",
			},
		},
		browserify: {
			default: {
				options: { browserifyOptions: { debug: true }, plugin: ["tsify"] },
				files: [
					{
						expand: true,
						cwd: "src",
						src: "pages/*.tsx",
						dest: "dist/",
						rename: (dest, src) => {
							return dest + src.replace(/\.tsx$/, ".js");
						},
					},
				],
			},
		},
		sass: {
			default: {
				options: {
					noCache: true,
					sourcemap: "none",
					style: "expanded",
				},
				files: [
					{
						expand: true,
						cwd: "src",
						src: ["**/*.scss", "!**/_*.scss"],
						dest: "dist/",
						ext: ".css",
					},
				],
			},
		},
		postcss: {
			options: {
				processors: [require("autoprefixer")({ overrideBrowserslist: "defaults" }), require("cssnano")()],
			},
			dist: {
				src: "dist/**/*.css",
			},
		},
		watch: {
			options: {
				livereload: true,
				atBegin: true,
			},
			typescript: {
				files: "src/**/*.{ts,tsx}",
				tasks: ["browserify", "minifyCode", "cleanUpCode"],
			},
			html: {
				files: ["src/**/*.{html,php,twig}", "src/**/.htaccess"],
				tasks: ["buildHtml"],
			},
			css: {
				files: "src/**/*.{css,scss,sass}",
				tasks: ["buildCss"],
			},
			fonts: {
				files: ["src/font/**/*"],
				tasks: ["buildFonts"],
			},
			images: {
				files: ["src/**/*.png", "src/**/*.jpg", "src/**/*.svg", "src/**/*.ico"],
				tasks: ["buildImages"],
			},
		},
	});

	// Code
	grunt.registerTask("cleanCode", ["clean:code"]);
	grunt.registerTask("cleanUpCode", ["clean:codeBuild"]);

	grunt.registerTask("buildCode", ["copy:code"]);
	grunt.registerTask("minifyCode", ["uglify"]);

	// HTML
	grunt.registerTask("cleanHtml", ["clean:html"]);

	grunt.registerTask("buildHtml", ["copy:html"]);

	// CSS
	grunt.registerTask("cleanCss", ["clean:css"]);

	grunt.registerTask("buildCss", ["sass", "copy:css", "postcss"]);

	// Fonts
	grunt.registerTask("cleanFonts", ["clean:fonts", "clean:fontsDeploy"]);

	grunt.registerTask("buildFonts", ["copy:fonts"]);

	// Images
	grunt.registerTask("cleanImages", ["clean:images"]);

	grunt.registerTask("buildImages", ["copy:images"]);

	// Complete Build
	grunt.registerTask("build", ["browserify", "minifyCode", "cleanUpCode", "buildHtml", "buildCss"]);
};
