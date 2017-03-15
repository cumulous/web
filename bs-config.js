module.exports = {
  port: 8082,
  files: [
    'coverage/**/*.html',
  ],
  snippetOptions: {
    rule: {
      match: /(<!DOCTYPE html>|^)/i,
      fn: function (snippet, match) {
          return match + '\n' + snippet;
      },
    },
  },
};