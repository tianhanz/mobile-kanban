module.exports = {
  plugins: {
    // Point Tailwind at this package's config. The file is named
    // `tailwind.new.config.cjs` (not the default `tailwind.config.js`),
    // so auto-discovery would fail and Tailwind would start with an empty
    // `content` array before the CSS `@config` directive overrides it.
    // The `.cjs` extension is required because this package has
    // `"type": "module"` in package.json — a `.js` file would be treated
    // as ESM and `module.exports = ...` would produce an empty config.
    tailwindcss: { config: require.resolve('./tailwind.new.config.cjs') },
    autoprefixer: {},
  },
};
