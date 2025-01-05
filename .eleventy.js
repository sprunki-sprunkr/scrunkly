module.exports = function(eleventyConfig) {
  // 复制静态文件
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/sitemap.xml"); 
  eleventyConfig.addPassthroughCopy("src/robots.txt"); 
  
  eleventyConfig.addFilter("filterByCategory", function(dict, category) {
    let result = {};
    for (let key in dict) {
      if (dict[key].category === category) {
        result[key] = dict[key];
      }
    }
    return result;
  });

  // 合并对象
  eleventyConfig.addFilter("merge", function(...objects) {
    return objects.reduce((result, obj) => {
      for (const key in obj) {
        if (!result.hasOwnProperty(key)) {
          result[key] = obj[key];
        }
      }
      return result;
    }, {});
  });
  
  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data"
    }
  };
};