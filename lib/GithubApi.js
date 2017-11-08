const Promise = require('bluebird')
const rest = require('rest');
const mime = require('rest/interceptor/mime');
const pathPrefix = require('rest/interceptor/pathPrefix')
const basicAuth = require('rest/interceptor/basicAuth')
const defaultRequest = require('rest/interceptor/defaultRequest')


class GithubApi {

    constructor(token, orgName, repo) {
        this.token = token;
        this.orgName = orgName;
        this.repo = repo;

        this.client = rest
            .wrap(mime)
            .wrap(defaultRequest, {
                headers: {
                    "User-Agent": "Github-Release-Extract",
                    "Authorization": "Bearer " + this.token
                }
            })
            .wrap(pathPrefix, { prefix: 'https://api.github.com/'});
    }

    getPageOfReleases(page) {

        let path = 'repos/' + this.orgName + '/' + this.repo + '/releases?page=' + page;

        console.log('path: ' + path)

        return this.client({
                path: path
            })
            .then((response) => {
                return response.entity;
            })
            .catch(err => {
                console.error(err);
                throw err;
            });
    }

    getReleases(page) {

        if (!page) page = 1;

        console.log('Getting releases page ' + page)

        return this.getPageOfReleases(page)
            .then(releases => {

                if (!releases.length) return [];

                return this.getReleases(++page)
                    .then(more => {
                        return releases.concat(more);
                    })
            })
    }
}


module.exports = GithubApi