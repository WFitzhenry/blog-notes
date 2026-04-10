const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/img");

  // Collections
  eleventyConfig.addCollection("notes", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/notes/*.md").reverse(),
  );
  eleventyConfig.addCollection("photos", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/photos/*.md").reverse(),
  );
  eleventyConfig.addCollection("reading", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/reading/*.md").reverse(),
  );
  eleventyConfig.addCollection("dev", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/dev/*.md").reverse(),
  );

  // Mixed feed for homepage: notes + photos + reading + dev, sorted newest first
  eleventyConfig.addCollection("feed", (collectionApi) => {
    const notes = collectionApi.getFilteredByGlob("src/notes/*.md");
    const photos = collectionApi.getFilteredByGlob("src/photos/*.md");
    const reading = collectionApi.getFilteredByGlob("src/reading/*.md");
    const dev = collectionApi.getFilteredByGlob("src/dev/*.md");
    return [...notes, ...photos, ...reading, ...dev].sort(
      (a, b) => b.date - a.date,
    );
  });

  // Filters
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "d MMMM, yyyy",
    );
  });

  eleventyConfig.addFilter("ordinalDate", (dateObj) => {
    const dt = DateTime.fromJSDate(dateObj, { zone: "utc" });
    const day = dt.day;
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
          ? "nd"
          : day % 10 === 3 && day !== 13
            ? "rd"
            : "th";
    return `${day}${suffix} ${dt.toFormat("MMMM, yyyy")}`;
  });

  eleventyConfig.addFilter("year", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy");
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site",
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
