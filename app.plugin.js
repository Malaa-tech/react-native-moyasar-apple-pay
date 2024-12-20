const {withDangerousMod} = require('@expo/config-plugins');
const path = require('path');
const fs = require('fs');
const {
    mergeContents,
} = require('@expo/config-plugins/build/utils/generateCode');

const withIOS = config => {
    return withDangerousMod(config, [
        'ios',
        async config => {
            const filePath = path.join(
                config.modRequest.platformProjectRoot,
                'Podfile',
            );
            const contents = fs.readFileSync(filePath, 'utf-8');

            const moyasarPodfileDep = mergeContents({
                tag: 'add Moyasar SDK to Podfile',
                src: contents,
                newSrc: [
                    `pod 'MoyasarSdk', git: 'https://github.com/moyasar/moyasar-ios-pod.git', :tag => 'v3.0.0'`,
                ].join('\n'),
                anchor: 'use_expo_modules!',
                offset: 1,
                comment: '#',
            });

            fs.writeFileSync(filePath, moyasarPodfileDep.contents);

            return config;
        },
    ]);
};

module.exports = withIOS;
