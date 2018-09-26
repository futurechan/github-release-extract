const json2csv = require('json2csv');
const GithubApi = require('./githubApi')
const fs = require('fs')
const Version = require('./Version')

module.exports = function(options, token, orgName, repo) {

    const githubApi = new GithubApi(token, orgName, repo);

    this.run = function() {

        let startVersion = new Version(options.startVersion);
        let endVersion = new Version(options.endVersion);

        githubApi.getReleases()
            .then(releases => {

                return releases.filter(release => {

                    let v = new Version(release.tag_name);

                    return Version.compare(startVersion, v) < 1
                        && Version.compare(v, endVersion) < 1;
                })
            })
            .then(releases => {

                let releaseNotes = releases.map(r => {

                    return {
                        tag: r.tag_name,
                        notes: r.body
                            .filter(row => row.trim() != '')
                             .join('\r\n')
                    }
                })

                console.log(releaseNotes);

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