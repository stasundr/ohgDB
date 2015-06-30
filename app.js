'use strict';

var config = require('./config');
var redis = require('./lib/redis');

var fs = require('fs');

var hg = 'ohg:hg:';
var hgs = 'ohg:hgs';
var raw = config.directory + '/data/rawDB.csv';
var data = fs
    .readFileSync(raw)
    .toString()
    .split('\r')
    .map(function(string) {
        return string
            .replace(/;/g, " ")
            .replace(/[\s][A-Za-z]+[0-9]+$/, "")
            .replace(/\s+$/, '')
            .replace(/[\s][A-Za-z]+[0-9]+$/, "")
            .replace(/\s+$/, '');
    })
    .filter(function(string) {
        return (string !== '');
    })
    .forEach(function(string, i, data) {
        var depth = function(_string) {
            return ((' ' + _string).match(/^\s+/g) + '').length;
        };

        var rootHg = function(where) {
            var currentDepth = depth(data[where]);
            if (currentDepth > 1) {
                var j = where;
                while (currentDepth <= depth(data[j])) j--;

                if (depth(data[j]) >= 1) {
                    var tmp = data[j].trim().split('  ');
                    tmp.shift();
                    tmp += '';
                    tail += ' ' + tmp.replace(/\,/g, '  ');
                    rootHg(j);
                }
            }
        };

        var tail = '';
        rootHg(i);
        var value = (data[i] + tail).trim().replace(/\s+/g, ' ').split(' ');
        var key = value.shift();
        value = value.toString().replace(/[a-zA-Z]/g,'').split(',').sort(function(a,b){return a-b});

        redis.rpush(hgs, key);
        redis.set(hg + key, value);
    });
console.log('Done!');