const json2csv = require('json2csv');
const GithubApi = require('./githubApi')
const fs = require('fs')

module.exports = function(options, token, orgName, repo) {

    const githubApi = new GithubApi(token, orgName, repo);

    this.run = function() {


        githubApi.getReleases()
            .then(releases => {

                return releases.filter(release => {
                    return (release.tag_name.indexOf(options.startVersion) == 0
                            || release.tag_name > options.startVersion)
                        && (release.tag_name.indexOf(options.endVersion) == 0
                            || release.tag_name < options.endVersion)
                })
            })
            .then(releases => {

                let releaseNotes = releases.map(r => {

                    return {
                        tag: r.tag_name,
                        notes: r.body
                    }
                })

                return json2csv({ data: releaseNotes, fields: ['tag', 'notes'] })
            })
            .then(csv => {
                fs.writeFile('notes.csv', csv, function(err) {
                    if (err) throw err;
                    console.log('file saved');
                });
            })
            .catch(err => {
                console.log(err);
            })

    }
}