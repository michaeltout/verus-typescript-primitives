"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRANSACTION_FIXTURES = void 0;
exports.TRANSACTION_FIXTURES = {
    "valid": [
        {
            "description": "Standard transaction (1:1)",
            "id": "a0ff943d3f644d8832b1fa74be4d0ad2577615dc28a7ef74ff8c271b603a082a",
            "hash": "2a083a601b278cff74efa728dc157657d20a4dbe74fab132884d643f3d94ffa0",
            "hex": "0100000001f1fefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefe000000006b4830450221008732a460737d956fd94d49a31890b2908f7ed7025a9c1d0f25e43290f1841716022004fa7d608a291d44ebbbebbadaac18f943031e7de39ef3bf9920998c43e60c0401210279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798ffffffff01a0860100000000001976a914c42e7ef92fdb603af844d064faad95db9bcdfd3d88ac00000000",
            "raw": {
                "version": 1,
                "ins": [
                    {
                        "hash": "f1fefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefe",
                        "index": 0,
                        "script": "30450221008732a460737d956fd94d49a31890b2908f7ed7025a9c1d0f25e43290f1841716022004fa7d608a291d44ebbbebbadaac18f943031e7de39ef3bf9920998c43e60c0401 0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"
                    }
                ],
                "outs": [
                    {
                        "script": "OP_DUP OP_HASH160 c42e7ef92fdb603af844d064faad95db9bcdfd3d OP_EQUALVERIFY OP_CHECKSIG",
                        "value": 100000
                    }
                ],
                "locktime": 0
            },
            "coinbase": false,
            "virtualSize": 192,
            "weight": 768
        },
        {
            "description": "Standard transaction (2:2)",
            "id": "fcdd6d89c43e76dcff94285d9b6e31d5c60cb5e397a76ebc4920befad30907bc",
            "hash": "bc0709d3fabe2049bc6ea797e3b50cc6d5316e9b5d2894ffdc763ec4896dddfc",
            "hex": "0100000002f1fefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefe000000006b483045022100e661badd8d2cf1af27eb3b82e61b5d3f5d5512084591796ae31487f5b82df948022006df3c2a2cac79f68e4b179f4bbb8185a0bb3c4a2486d4405c59b2ba07a74c2101210279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798fffffffff2fefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefe0100000083483045022100be54a46a44fb7e6bf4ebf348061d0dace7ddcbb92d4147ce181cf4789c7061f0022068ccab2a89a47fc29bb5074bca99ae846ab446eecf3c3aaeb238a13838783c78012102c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee517a9147ccb85f0ab2d599bc17246c98babd5a20b1cdc7687000000800250c30000000000001976a914c42e7ef92fdb603af844d064faad95db9bcdfd3d88acf04902000000000017a9147ccb85f0ab2d599bc17246c98babd5a20b1cdc768700000000",
            "raw": {
                "version": 1,
                "ins": [
                    {
                        "hash": "f1fefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefe",
                        "index": 0,
                        "script": "3045022100e661badd8d2cf1af27eb3b82e61b5d3f5d5512084591796ae31487f5b82df948022006df3c2a2cac79f68e4b179f4bbb8185a0bb3c4a2486d4405c59b2ba07a74c2101 0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
                        "sequence": 4294967295
                    },
                    {
                        "hash": "f2fefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefe",
                        "index": 1,
                        "script": "3045022100be54a46a44fb7e6bf4ebf348061d0dace7ddcbb92d4147ce181cf4789c7061f0022068ccab2a89a47fc29bb5074bca99ae846ab446eecf3c3aaeb238a13838783c7801 02c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5 a9147ccb85f0ab2d599bc17246c98babd5a20b1cdc7687",
                        "sequence": 2147483648
                    }
                ],
                "outs": [
                    {
                        "script": "OP_DUP OP_HASH160 c42e7ef92fdb603af844d064faad95db9bcdfd3d OP_EQUALVERIFY OP_CHECKSIG",
                        "value": 50000
                    },
                    {
                        "script": "OP_HASH160 7ccb85f0ab2d599bc17246c98babd5a20b1cdc76 OP_EQUAL",
                        "value": 150000
                    }
                ],
                "locktime": 0
            },
            "coinbase": false,
            "virtualSize": 396,
            "weight": 1584
        },
        {
            "description": "Standard transaction (14:2)",
            "id": "39d57bc27f72e904d81f6b5ef7b4e6e17fa33a06b11e5114a43435830d7b5563",
            "hash": "63557b0d833534a414511eb1063aa37fe1e6b4f75e6b1fd804e9727fc27bd539",
            "hex": "010000000ee7b73e229790c1e79a02f0c871813b3cf26a4156c5b8d942e88b38fe8d3f43a0000000008c493046022100fd3d8fef44fb0962ba3f07bee1d4cafb84e60e38e6c7d9274504b3638a8d2f520221009fce009044e615b6883d4bf62e04c48f9fe236e19d644b082b2f0ae5c98e045c014104aa592c859fd00ed2a02609aad3a1bf72e0b42de67713e632c70a33cc488c15598a0fb419370a54d1c275b44380e8777fc01b6dc3cd43a416c6bab0e30dc1e19fffffffff7bfc005f3880a606027c7cd7dd02a0f6a6572eeb84a91aa158311be13695a7ea010000008b483045022100e2e61c40f26e2510b76dc72ea2f568ec514fce185c719e18bca9caaef2b20e9e02207f1100fc79eb0584e970c7f18fb226f178951d481767b4092d50d13c50ccba8b014104aa592c859fd00ed2a02609aad3a1bf72e0b42de67713e632c70a33cc488c15598a0fb419370a54d1c275b44380e8777fc01b6dc3cd43a416c6bab0e30dc1e19fffffffff0e0f8e6bf951fbb84d7d8ef833a1cbf5bb046ea7251973ac6e7661c755386ee3010000008a473044022048f1611e403710f248f7caf479965a6a5f63cdfbd9a714fef4ec1b68331ade1d022074919e79376c363d4575b2fc21513d5949471703efebd4c5ca2885e810eb1fa4014104aa592c859fd00ed2a02609aad3a1bf72e0b42de67713e632c70a33cc488c15598a0fb419370a54d1c275b44380e8777fc01b6dc3cd43a416c6bab0e30dc1e19fffffffffe6f17f35bf9f0aa7a4242ab3e29edbdb74c5274bf263e53043dddb8045cb585b000000008b483045022100886c07cad489dfcf4b364af561835d5cf985f07adf8bd1d5bd6ddea82b0ce6b2022045bdcbcc2b5fc55191bb997039cf59ff70e8515c56b62f293a9add770ba26738014104aa592c859fd00ed2a02609aad3a1bf72e0b42de67713e632c70a33cc488c15598a0fb419370a54d1c275b44380e8777fc01b6dc3cd43a416c6bab0e30dc1e19fffffffffe6f17f35bf9f0aa7a4242ab3e29edbdb74c5274bf263e53043dddb8045cb585b010000008a4730440220535d49b819fdf294d27d82aff2865ed4e18580f0ca9796d793f611cb43a44f47022019584d5e300c415f642e37ba2a814a1e1106b4a9b91dc2a30fb57ceafe041181014104aa592c859fd00ed2a02609aad3a1bf72e0b42de67713e632c70a33cc488c15598a0fb419370a54d1c275b44380e8777fc01b6dc3cd43a416c6bab0e30dc1e19fffffffffd3051677216ea53baa2e6d7f6a75434ac338438c59f314801c8496d1e6d1bf6d010000008b483045022100bf612b0fa46f49e70ab318ca3458d1ed5f59727aa782f7fac5503f54d9b43a590220358d7ed0e3cee63a5a7e972d9fad41f825d95de2fd0c5560382468610848d489014104aa592c859fd00ed2a02609aad3a1bf72e0b42de67713e632c70a33cc488c15598a0fb419370a54d1c275b44380e8777fc01b6dc3cd43a416c6bab0e30dc1e19fffffffff1e751ccc4e7d973201e9174ec78ece050ef2fadd6a108f40f76a9fa314979c31010000008b483045022006e263d5f73e05c48a603e3bd236e8314e5420721d5e9020114b93e8c9220e1102210099d3dead22f4a792123347a238c87e67b55b28a94a0bb7793144cc7ad94a0168014104aa592c859fd00ed2a02609aad3a1bf72e0b42de67713e632c70a33cc488c15598a0fb419370a54d1c275b44380e8777fc01b6dc3cd43a416c6bab0e30dc1e19fffffffff25c4cf2c61743b3f4252d921d937cca942cf32e4f3fa4a544d0b26f014337084010000008a47304402207d6e87588be47bf2d97eaf427bdd992e9d6b306255711328aee38533366a88b50220623099595ae442cb77eaddb3f91753a4fc9df56fde69cfec584c7f97e05533c8014104aa592c859fd00ed2a02609aad3a1bf72e0b42de67713e632c70a33cc488c15598a0fb419370a54d1c275b44380e8777fc01b6dc3cd43a416c6bab0e30dc1e19fffffffffecd93c87eb43c48481e6694904305349bdea94b01104579fa9f02bff66c89663010000008a473044022020f59498aee0cf82cb113768ef3cb721000346d381ff439adb4d405f791252510220448de723aa59412266fabbc689ec25dc94b1688c27a614982047513a80173514014104aa592c859fd00ed2a02609aad3a1bf72e0b42de67713e632c70a33cc488c15598a0fb419370a54d1c275b44380e8777fc01b6dc3cd43a416c6bab0e30dc1e19fffffffffa1fdc0a79ff98d5b6154176e321c22f4f8450dbd950bd013ad31135f5604411e010000008b48304502210088167867f87327f9c0db0444267ff0b6a026eedd629d8f16fe44a34c18e706bf0220675c8baebf89930e2d6e4463adefc50922653af99375242e38f5ee677418738a014104aa592c859fd00ed2a02609aad3a1bf72e0b42de67713e632c70a33cc488c15598a0fb419370a54d1c275b44380e8777fc01b6dc3cd43a416c6bab0e30dc1e19fffffffffb89e8249c3573b58bf1ec7433185452dd57ab8e1daab01c3cc6ddc8b66ad3de8000000008b4830450220073d50ac5ec8388d5b3906921f9368c31ad078c8e1fb72f26d36b533f35ee327022100c398b23e6692e11dca8a1b64aae2ff70c6a781ed5ee99181b56a2f583a967cd4014104aa592c859fd00ed2a02609aad3a1bf72e0b42de67713e632c70a33cc488c15598a0fb419370a54d1c275b44380e8777fc01b6dc3cd43a416c6bab0e30dc1e19fffffffff45ee07e182084454dacfad1e61b04ffdf9c7b01003060a6c841a01f4fff8a5a0010000008b483045022100991d1bf60c41358f08b20e53718a24e05ac0608915df4f6305a5b47cb61e5da7022003f14fc1cc5b737e2c3279a4f9be1852b49dbb3d9d6cc4c8af6a666f600dced8014104aa592c859fd00ed2a02609aad3a1bf72e0b42de67713e632c70a33cc488c15598a0fb419370a54d1c275b44380e8777fc01b6dc3cd43a416c6bab0e30dc1e19fffffffff4cba12549f1d70f8e60aea8b546c8357f7c099e7c7d9d8691d6ee16e7dfa3170010000008c493046022100f14e2b0ef8a8e206db350413d204bc0a5cd779e556b1191c2d30b5ec023cde6f022100b90b2d2bf256c98a88f7c3a653b93cec7d25bb6a517db9087d11dbd189e8851c014104aa592c859fd00ed2a02609aad3a1bf72e0b42de67713e632c70a33cc488c15598a0fb419370a54d1c275b44380e8777fc01b6dc3cd43a416c6bab0e30dc1e19fffffffffa4b3aed39eb2a1dc6eae4609d9909724e211c153927c230d02bd33add3026959010000008b483045022100a8cebb4f1c58f5ba1af91cb8bd4a2ed4e684e9605f5a9dc8b432ed00922d289d0220251145d2d56f06d936fd0c51fa884b4a6a5fafd0c3318f72fb05a5c9aa372195014104aa592c859fd00ed2a02609aad3a1bf72e0b42de67713e632c70a33cc488c15598a0fb419370a54d1c275b44380e8777fc01b6dc3cd43a416c6bab0e30dc1e19fffffffff0240d52303000000001976a914167c3e1f10cc3b691c73afbdb211e156e3e3f25c88ac15462e00000000001976a914290f7d617b75993e770e5606335fa0999a28d71388ac00000000",
            "raw": {
                "version": 1,
                "locktime": 0,
                "ins": [
                    {
                        "hash": "e7b73e229790c1e79a02f0c871813b3cf26a4156c5b8d942e88b38fe8d3f43a0",
                        "index": 0,
                        "script": "3046022100fd3d8fef44fb0962ba3f07bee1d4cafb84e60e38e6c7d9274504b3638a8d2f520221009fce009044e615b6883d4bf62e04c48f9fe236e19d644b082b2f0ae5c98e045c01 04aa592c859fd00ed2a02609aad3a1bf72e0b42de67713e632c70a33cc488c15598a0fb419370a54d1c275b44380e8777fc01b6dc3cd43a416c6bab0e30dc1e19f",
                        "sequence": null
                    },
                    {
                        "hash": "7bfc005f3880a606027c7cd7dd02a0f6a6572eeb84a91aa158311be13695a7ea",
                        "index": 1,
                        "script": "3045022100e2e61c40f26e2510b76dc72ea2f568ec514fce185c719e18bca9caaef2b20e9e02207f1100fc79eb0584e970c7f18fb226f178951d481767b4092d50d13c50ccba8b01 04aa592c859fd00ed2a02609aad3a1bf72e0b42de67713e632c70a33cc488c15598a0fb419370a54d1c275b44380e8777fc01b6dc3cd43a416c6bab0e30dc1e19f"
                    },
                    {
                        "hash": "0e0f8e6bf951fbb84d7d8ef833a1cbf5bb046ea7251973ac6e7661c755386ee3",
                        "index": 1,
                        "script": "3044022048f1611e403710f248f7caf479965a6a5f63cdfbd9a714fef4ec1b68331ade1d022074919e79376c363d4575b2fc21513d5949471703efebd4c5ca2885e810eb1fa401 04aa592c859fd00ed2a02609aad3a1bf72e0b42de67713e632c70a33cc488c15598a0fb419370a54d1c275b44380e8777fc01b6dc3cd43a416c6bab0e30dc1e19f"
                    },
                    {
                        "hash": "e6f17f35bf9f0aa7a4242ab3e29edbdb74c5274bf263e53043dddb8045cb585b",
                        "index": 0,
                        "script": "3045022100886c07cad489dfcf4b364af561835d5cf985f07adf8bd1d5bd6ddea82b0ce6b2022045bdcbcc2b5fc55191bb997039cf59ff70e8515c56b62f293a9add770ba2673801 04aa592c859fd00ed2a02609aad3a1bf72e0b42de67713e632c70a33cc488c15598a0fb419370a54d1c275b44380e8777fc01b6dc3cd43a416c6bab0e30dc1e19f"
                    },
                    {
                        "hash": "e6f17f35bf9f0aa7a4242ab3e29edbdb74c5274bf263e53043dddb8045cb585b",
                        "index": 1,
                        "script": "30440220535d49b819fdf294d27d82aff2865ed4e18580f0ca9796d793f611cb43a44f47022019584d5e300c415f642e37ba2a814a1e1106b4a9b91dc2a30fb57ceafe04118101 04aa592c859fd00ed2a02609aad3a1bf72e0b42de67713e632c70a33cc488c15598a0fb419370a54d1c275b44380e8777fc01b6dc3cd43a416c6bab0e30dc1e19f"
                    },
                    {
                        "hash": "d3051677216ea53baa2e6d7f6a75434ac338438c59f314801c8496d1e6d1bf6d",
                        "index": 1,
                        "script": "3045022100bf612b0fa46f49e70ab318ca3458d1ed5f59727aa782f7fac5503f54d9b43a590220358d7ed0e3cee63a5a7e972d9fad41f825d95de2fd0c5560382468610848d48901 04aa592c859fd00ed2a02609aad3a1bf72e0b42de67713e632c70a33cc488c15598a0fb419370a54d1c275b44380e8777fc01b6dc3cd43a416c6bab0e30dc1e19f"
                    },
                    {
                        "hash": "1e751ccc4e7d973201e9174ec78ece050ef2fadd6a108f40f76a9fa314979c31",
                        "index": 1,
                        "script": "3045022006e263d5f73e05c48a603e3bd236e8314e5420721d5e9020114b93e8c9220e1102210099d3dead22f4a792123347a238c87e67b55b28a94a0bb7793144cc7ad94a016801 04aa592c859fd00ed2a02609aad3a1bf72e0b42de67713e632c70a33cc488c15598a0fb419370a54d1c275b44380e8777fc01b6dc3cd43a416c6bab0e30dc1e19f"
                    },
                    {
                        "hash": "25c4cf2c61743b3f4252d921d937cca942cf32e4f3fa4a544d0b26f014337084",
                        "index": 1,
                        "script": "304402207d6e87588be47bf2d97eaf427bdd992e9d6b306255711328aee38533366a88b50220623099595ae442cb77eaddb3f91753a4fc9df56fde69cfec584c7f97e05533c801 04aa592c859fd00ed2a02609aad3a1bf72e0b42de67713e632c70a33cc488c15598a0fb419370a54d1c275b44380e8777fc01b6dc3cd43a416c6bab0e30dc1e19f"
                    },
                    {
                        "hash": "ecd93c87eb43c48481e6694904305349bdea94b01104579fa9f02bff66c89663",
                        "index": 1,
                        "script": "3044022020f59498aee0cf82cb113768ef3cb721000346d381ff439adb4d405f791252510220448de723aa59412266fabbc689ec25dc94b1688c27a614982047513a8017351401 04aa592c859fd00ed2a02609aad3a1bf72e0b42de67713e632c70a33cc488c15598a0fb419370a54d1c275b44380e8777fc01b6dc3cd43a416c6bab0e30dc1e19f"
                    },
                    {
                        "hash": "a1fdc0a79ff98d5b6154176e321c22f4f8450dbd950bd013ad31135f5604411e",
                        "index": 1,
                        "script": "304502210088167867f87327f9c0db0444267ff0b6a026eedd629d8f16fe44a34c18e706bf0220675c8baebf89930e2d6e4463adefc50922653af99375242e38f5ee677418738a01 04aa592c859fd00ed2a02609aad3a1bf72e0b42de67713e632c70a33cc488c15598a0fb419370a54d1c275b44380e8777fc01b6dc3cd43a416c6bab0e30dc1e19f"
                    },
                    {
                        "hash": "b89e8249c3573b58bf1ec7433185452dd57ab8e1daab01c3cc6ddc8b66ad3de8",
                        "index": 0,
                        "script": "30450220073d50ac5ec8388d5b3906921f9368c31ad078c8e1fb72f26d36b533f35ee327022100c398b23e6692e11dca8a1b64aae2ff70c6a781ed5ee99181b56a2f583a967cd401 04aa592c859fd00ed2a02609aad3a1bf72e0b42de67713e632c70a33cc488c15598a0fb419370a54d1c275b44380e8777fc01b6dc3cd43a416c6bab0e30dc1e19f"
                    },
                    {
                        "hash": "45ee07e182084454dacfad1e61b04ffdf9c7b01003060a6c841a01f4fff8a5a0",
                        "index": 1,
                        "script": "3045022100991d1bf60c41358f08b20e53718a24e05ac0608915df4f6305a5b47cb61e5da7022003f14fc1cc5b737e2c3279a4f9be1852b49dbb3d9d6cc4c8af6a666f600dced801 04aa592c859fd00ed2a02609aad3a1bf72e0b42de67713e632c70a33cc488c15598a0fb419370a54d1c275b44380e8777fc01b6dc3cd43a416c6bab0e30dc1e19f"
                    },
                    {
                        "hash": "4cba12549f1d70f8e60aea8b546c8357f7c099e7c7d9d8691d6ee16e7dfa3170",
                        "index": 1,
                        "script": "3046022100f14e2b0ef8a8e206db350413d204bc0a5cd779e556b1191c2d30b5ec023cde6f022100b90b2d2bf256c98a88f7c3a653b93cec7d25bb6a517db9087d11dbd189e8851c01 04aa592c859fd00ed2a02609aad3a1bf72e0b42de67713e632c70a33cc488c15598a0fb419370a54d1c275b44380e8777fc01b6dc3cd43a416c6bab0e30dc1e19f"
                    },
                    {
                        "hash": "a4b3aed39eb2a1dc6eae4609d9909724e211c153927c230d02bd33add3026959",
                        "index": 1,
                        "script": "3045022100a8cebb4f1c58f5ba1af91cb8bd4a2ed4e684e9605f5a9dc8b432ed00922d289d0220251145d2d56f06d936fd0c51fa884b4a6a5fafd0c3318f72fb05a5c9aa37219501 04aa592c859fd00ed2a02609aad3a1bf72e0b42de67713e632c70a33cc488c15598a0fb419370a54d1c275b44380e8777fc01b6dc3cd43a416c6bab0e30dc1e19f"
                    }
                ],
                "outs": [
                    {
                        "value": 52680000,
                        "script": "OP_DUP OP_HASH160 167c3e1f10cc3b691c73afbdb211e156e3e3f25c OP_EQUALVERIFY OP_CHECKSIG"
                    },
                    {
                        "value": 3032597,
                        "script": "OP_DUP OP_HASH160 290f7d617b75993e770e5606335fa0999a28d713 OP_EQUALVERIFY OP_CHECKSIG"
                    }
                ]
            },
            "coinbase": false,
            "virtualSize": 2596,
            "weight": 10384
        },
        {
            "description": "Coinbase transaction",
            "id": "8e070d4eb85eb02e02dd938d6552316b9d723330707870c518064b7a0d232da3",
            "hash": "a32d230d7a4b0618c57078703033729d6b3152658d93dd022eb05eb84e0d078e",
            "hex": "01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff29032832051c4d696e656420627920416e74506f6f6c20626a343a45ef0454c5de8d5e5300004e2c0000ffffffff01414f1995000000001976a914b05793fe86a9f51a5f5ae3a6f07fd31932128a3f88ac00000000",
            "raw": {
                "version": 1,
                "ins": [
                    {
                        "hash": "0000000000000000000000000000000000000000000000000000000000000000",
                        "index": 4294967295,
                        "data": "032832051c4d696e656420627920416e74506f6f6c20626a343a45ef0454c5de8d5e5300004e2c0000"
                    }
                ],
                "outs": [
                    {
                        "script": "OP_DUP OP_HASH160 b05793fe86a9f51a5f5ae3a6f07fd31932128a3f OP_EQUALVERIFY OP_CHECKSIG",
                        "value": 2501463873
                    }
                ],
                "locktime": 0
            },
            "coinbase": true,
            "virtualSize": 126,
            "weight": 504
        },
        {
            "description": "Transaction that ignores script chunking rules - Bug #367",
            "id": "ebc9fa1196a59e192352d76c0f6e73167046b9d37b8302b6bb6968dfd279b767",
            "hash": "67b779d2df6869bbb602837bd3b9467016736e0f6cd75223199ea59611fac9eb",
            "hex": "01000000019ac03d5ae6a875d970128ef9086cef276a1919684a6988023cc7254691d97e6d010000006b4830450221009d41dc793ba24e65f571473d40b299b6459087cea1509f0d381740b1ac863cb6022039c425906fcaf51b2b84d8092569fb3213de43abaff2180e2a799d4fcb4dd0aa012102d5ede09a8ae667d0f855ef90325e27f6ce35bbe60a1e6e87af7f5b3c652140fdffffffff080100000000000000010101000000000000000202010100000000000000014c0100000000000000034c02010100000000000000014d0100000000000000044dffff010100000000000000014e0100000000000000064effffffff0100000000",
            "raw": {
                "version": 1,
                "locktime": 0,
                "ins": [
                    {
                        "hash": "9ac03d5ae6a875d970128ef9086cef276a1919684a6988023cc7254691d97e6d",
                        "index": 1,
                        "script": "30450221009d41dc793ba24e65f571473d40b299b6459087cea1509f0d381740b1ac863cb6022039c425906fcaf51b2b84d8092569fb3213de43abaff2180e2a799d4fcb4dd0aa01 02d5ede09a8ae667d0f855ef90325e27f6ce35bbe60a1e6e87af7f5b3c652140fd"
                    }
                ],
                "outs": [
                    {
                        "data": "01",
                        "value": 1
                    },
                    {
                        "data": "0201",
                        "value": 1
                    },
                    {
                        "data": "4c",
                        "value": 1
                    },
                    {
                        "data": "4c0201",
                        "value": 1
                    },
                    {
                        "data": "4d",
                        "value": 1
                    },
                    {
                        "data": "4dffff01",
                        "value": 1
                    },
                    {
                        "data": "4e",
                        "value": 1
                    },
                    {
                        "data": "4effffffff01",
                        "value": 1
                    }
                ]
            },
            "coinbase": false,
            "virtualSize": 249,
            "weight": 996
        },
        {
            "description": "P2PK",
            "id": "8d4733995be9b3331a65eeb31bce24b213d4fabcbadf7f6634a8fea442c13e6a",
            "hash": "6a3ec142a4fea834667fdfbabcfad413b224ce1bb3ee651a33b3e95b9933478d",
            "hex": "010000000193aef40ae141694895e99e18e49d0181b086dd7c011c0241175c6eaf320099970000000049483045022100e57eba5380dcc8a7bdb5370b423dadd43070e1ca268f94bc97b2ded55ca45e9502206a43151c8af03a00f0ac86526d07981e303fc0daea8c6ed435abe8961533046d01ffffffff0160ea0000000000001976a914851a33a5ef0d4279bd5854949174e2c65b1d450088ac00000000",
            "whex": "",
            "raw": {
                "version": 1,
                "ins": [
                    {
                        "hash": "93aef40ae141694895e99e18e49d0181b086dd7c011c0241175c6eaf32009997",
                        "index": 0,
                        "script": "3045022100e57eba5380dcc8a7bdb5370b423dadd43070e1ca268f94bc97b2ded55ca45e9502206a43151c8af03a00f0ac86526d07981e303fc0daea8c6ed435abe8961533046d01",
                        "value": 80000
                    }
                ],
                "outs": [
                    {
                        "value": 60000,
                        "script": "OP_DUP OP_HASH160 851a33a5ef0d4279bd5854949174e2c65b1d4500 OP_EQUALVERIFY OP_CHECKSIG"
                    }
                ],
                "locktime": 0
            },
            "coinbase": false,
            "virtualSize": 158,
            "weight": 632
        },
        {
            "description": "P2SH P2PK",
            "id": "d4ebb5e09c06dd375f265b51eb7f1a14d12deba71329500e2a00a905fdfdc27d",
            "hash": "7dc2fdfd05a9002a0e502913a7eb2dd1141a7feb515b265f37dd069ce0b5ebd4",
            "hex": "0100000001a30e865fa60f6c25a8b218bb5a6b9acc7cf3f1db2f2e3a7114b51af5d6ae811f000000006c473044022026d2b56b6cb0269bf4e80dd655b9e917019e2ccef57f4b858d03bb45a2da59d9022010519a7f327f03e7c9613e0694f929544af29d3682e7ec8f19147e7a86651ecd012321038de63cf582d058a399a176825c045672d5ff8ea25b64d28d4375dcdb14c02b2bacffffffff0160ea0000000000001976a914851a33a5ef0d4279bd5854949174e2c65b1d450088ac00000000",
            "whex": "",
            "raw": {
                "version": 1,
                "ins": [
                    {
                        "hash": "a30e865fa60f6c25a8b218bb5a6b9acc7cf3f1db2f2e3a7114b51af5d6ae811f",
                        "index": 0,
                        "script": "3044022026d2b56b6cb0269bf4e80dd655b9e917019e2ccef57f4b858d03bb45a2da59d9022010519a7f327f03e7c9613e0694f929544af29d3682e7ec8f19147e7a86651ecd01 21038de63cf582d058a399a176825c045672d5ff8ea25b64d28d4375dcdb14c02b2bac",
                        "value": 80000
                    }
                ],
                "outs": [
                    {
                        "value": 60000,
                        "script": "OP_DUP OP_HASH160 851a33a5ef0d4279bd5854949174e2c65b1d4500 OP_EQUALVERIFY OP_CHECKSIG",
                        "scriptHex": "76a914851a33a5ef0d4279bd5854949174e2c65b1d450088ac"
                    }
                ],
                "locktime": 0
            },
            "coinbase": false,
            "virtualSize": 193,
            "weight": 772
        },
        {
            "description": "P2PKH",
            "id": "c7a77aeadf529759c8db9b3f205d690cdaed3df0eaf441ead648086e85a6a280",
            "hash": "80a2a6856e0848d6ea41f4eaf03dedda0c695d203f9bdbc8599752dfea7aa7c7",
            "hex": "010000000176d7b05b96e69d9760bacf14e496ea01085eff32be8f4e08b299eb92057826e5000000006b4830450221009bd6ff2561437155913c289923175d3f114cca1c0e2bc5989315d5261502c2c902201b71ad90dce076a5eb872330ed729e7c2c4bc2d0513efff099dbefb3b62eab4f0121038de63cf582d058a399a176825c045672d5ff8ea25b64d28d4375dcdb14c02b2bffffffff0160ea0000000000001976a914851a33a5ef0d4279bd5854949174e2c65b1d450088ac00000000",
            "whex": "",
            "raw": {
                "version": 1,
                "ins": [
                    {
                        "hash": "76d7b05b96e69d9760bacf14e496ea01085eff32be8f4e08b299eb92057826e5",
                        "index": 0,
                        "script": "30450221009bd6ff2561437155913c289923175d3f114cca1c0e2bc5989315d5261502c2c902201b71ad90dce076a5eb872330ed729e7c2c4bc2d0513efff099dbefb3b62eab4f01 038de63cf582d058a399a176825c045672d5ff8ea25b64d28d4375dcdb14c02b2b"
                    }
                ],
                "outs": [
                    {
                        "value": 60000,
                        "script": "OP_DUP OP_HASH160 851a33a5ef0d4279bd5854949174e2c65b1d4500 OP_EQUALVERIFY OP_CHECKSIG"
                    }
                ],
                "locktime": 0
            },
            "coinbase": false,
            "virtualSize": 192,
            "weight": 768
        },
        {
            "description": "P2SH P2PKH",
            "id": "0b8fa64f89b95666a23e424fe94e9114806726be9753e140dbd74c0d673c9593",
            "hash": "93953c670d4cd7db40e15397be26678014914ee94f423ea26656b9894fa68f0b",
            "hex": "01000000014b9ffc17c3cce03ee66980bf32d36aaa13462980c3af9d9d29ec6b97ab1c91650000000084473044022003d738d855d0c54a419ac62ebe1a1c0bf2dc6993c9585adb9a8666736658107002204d57ff62ee7efae6df73430bba62494faeba8c125a4abcf2488757a4f8877dd50121038de63cf582d058a399a176825c045672d5ff8ea25b64d28d4375dcdb14c02b2b1976a914851a33a5ef0d4279bd5854949174e2c65b1d450088acffffffff0160ea0000000000001976a914851a33a5ef0d4279bd5854949174e2c65b1d450088ac00000000",
            "whex": "",
            "raw": {
                "version": 1,
                "ins": [
                    {
                        "hash": "4b9ffc17c3cce03ee66980bf32d36aaa13462980c3af9d9d29ec6b97ab1c9165",
                        "index": 0,
                        "script": "3044022003d738d855d0c54a419ac62ebe1a1c0bf2dc6993c9585adb9a8666736658107002204d57ff62ee7efae6df73430bba62494faeba8c125a4abcf2488757a4f8877dd501 038de63cf582d058a399a176825c045672d5ff8ea25b64d28d4375dcdb14c02b2b 76a914851a33a5ef0d4279bd5854949174e2c65b1d450088ac"
                    }
                ],
                "outs": [
                    {
                        "value": 60000,
                        "script": "OP_DUP OP_HASH160 851a33a5ef0d4279bd5854949174e2c65b1d4500 OP_EQUALVERIFY OP_CHECKSIG"
                    }
                ],
                "locktime": 0
            },
            "coinbase": false,
            "virtualSize": 217,
            "weight": 868
        },
        {
            "description": "Multisig",
            "id": "7f5d96a866a815f5a1896fcd3b49cd00ac4c366a371fe8555f124e628e977a5e",
            "hash": "5e7a978e624e125f55e81f376a364cac00cd493bcd6f89a1f515a866a8965d7f",
            "hex": "010000000179310ec46e734b3490ee839c5ae4a09d28561ee9fff2d051f733d201f958d6d2000000004a00483045022100d269531f120f377ed2f94f42bef893ff2fe6544ac97fb477fa291bc6cfb7647e02200983f6a5bbd4ce6cf97f571995634805a7324cc5d8353ed954fa62477b0fcd0901ffffffff0160ea0000000000001976a914851a33a5ef0d4279bd5854949174e2c65b1d450088ac00000000",
            "whex": "",
            "raw": {
                "version": 1,
                "ins": [
                    {
                        "hash": "79310ec46e734b3490ee839c5ae4a09d28561ee9fff2d051f733d201f958d6d2",
                        "index": 0,
                        "script": "OP_0 3045022100d269531f120f377ed2f94f42bef893ff2fe6544ac97fb477fa291bc6cfb7647e02200983f6a5bbd4ce6cf97f571995634805a7324cc5d8353ed954fa62477b0fcd0901"
                    }
                ],
                "outs": [
                    {
                        "value": 60000,
                        "script": "OP_DUP OP_HASH160 851a33a5ef0d4279bd5854949174e2c65b1d4500 OP_EQUALVERIFY OP_CHECKSIG"
                    }
                ],
                "locktime": 0
            },
            "coinbase": false,
            "virtualSize": 159,
            "weight": 636
        },
        {
            "description": "P2SH Multisig",
            "id": "3aef827e4306bab01f118a8eccad74713bcd1695362caf9fed55202ed54ef88b",
            "hash": "8bf84ed52e2055ed9faf2c369516cd3b7174adcc8e8a111fb0ba06437e82ef3a",
            "hex": "010000000152882c661c49dd2f53bd9ced7e9f44b184888ad2fe7d86737f0efaa7aecdced1000000006f00473044022025f2e161f0a97888df948f4dcc7c04fe502510b8d8260ca9920f38d55e4d17720220271b6843224b3a34542a4df31781d048da56ee46b8c5fb99043e30abd527b2d801255121038de63cf582d058a399a176825c045672d5ff8ea25b64d28d4375dcdb14c02b2b51aeffffffff0160ea0000000000001976a914851a33a5ef0d4279bd5854949174e2c65b1d450088ac00000000",
            "whex": "",
            "raw": {
                "version": 1,
                "ins": [
                    {
                        "hash": "52882c661c49dd2f53bd9ced7e9f44b184888ad2fe7d86737f0efaa7aecdced1",
                        "index": 0,
                        "script": "OP_0 3044022025f2e161f0a97888df948f4dcc7c04fe502510b8d8260ca9920f38d55e4d17720220271b6843224b3a34542a4df31781d048da56ee46b8c5fb99043e30abd527b2d801 5121038de63cf582d058a399a176825c045672d5ff8ea25b64d28d4375dcdb14c02b2b51ae"
                    }
                ],
                "outs": [
                    {
                        "value": 60000,
                        "script": "OP_DUP OP_HASH160 851a33a5ef0d4279bd5854949174e2c65b1d4500 OP_EQUALVERIFY OP_CHECKSIG",
                        "scriptHex": "76a914851a33a5ef0d4279bd5854949174e2c65b1d450088ac"
                    }
                ],
                "locktime": 0
            },
            "coinbase": false,
            "virtualSize": 196,
            "weight": 784
        },
    ],
    "hashForSignature": [
        {
            "description": "Out of range inIndex",
            "txHex": "010000000200000000000000000000000000000000000000000000000000000000000000000000000000ffffffff00000000000000000000000000000000000000000000000000000000000000000000000000ffffffff01e8030000000000000000000000",
            "inIndex": 2,
            "script": "OP_0",
            "type": 0,
            "hash": "0000000000000000000000000000000000000000000000000000000000000001"
        },
        {
            "description": "inIndex > nOutputs (SIGHASH_SINGLE)",
            "txHex": "010000000200000000000000000000000000000000000000000000000000000000000000000000000000ffffffff00000000000000000000000000000000000000000000000000000000000000000000000000ffffffff01e8030000000000000000000000",
            "inIndex": 2,
            "script": "OP_0",
            "type": 3,
            "hash": "0000000000000000000000000000000000000000000000000000000000000001"
        },
        {
            "txHex": "010000000200000000000000000000000000000000000000000000000000000000000000000000000000ffffffff00000000000000000000000000000000000000000000000000000000000000000000000000ffffffff01e8030000000000000000000000",
            "inIndex": 0,
            "script": "OP_0 OP_3",
            "type": 0,
            "hash": "3d56a632462b9fc9b89eeddcad7dbe476297f34aff7e5f9320e2a99fb5e97136"
        },
        {
            "txHex": "010000000200000000000000000000000000000000000000000000000000000000000000000000000000ffffffff00000000000000000000000000000000000000000000000000000000000000000000000000ffffffff01e8030000000000000000000000",
            "inIndex": 0,
            "script": "OP_0 OP_CODESEPARATOR OP_3",
            "type": 0,
            "hash": "3d56a632462b9fc9b89eeddcad7dbe476297f34aff7e5f9320e2a99fb5e97136"
        },
        {
            "txHex": "010000000200000000000000000000000000000000000000000000000000000000000000000000000000ffffffff00000000000000000000000000000000000000000000000000000000000000000000000000ffffffff01e8030000000000000000000000",
            "inIndex": 0,
            "script": "OP_0 OP_CODESEPARATOR OP_4",
            "type": 0,
            "hash": "fa075877cb54916236806a6562e4a8cdad48adf1268e73d72d1f9fdd867df463"
        }
    ],
    "invalid": {
        "addInput": [
            {
                "exception": "Expected input hash to have length 32, got length 30",
                "hash": "0aed1366a73b6057ee7800d737bff1bdf8c448e98d86bc0998f2b009816d",
                "index": 0
            },
            {
                "exception": "Expected input hash to have length 32, got length 34",
                "hash": "0aed1366a73b6057ee7800d737bff1bdf8c448e98d86bc0998f2b009816da9b0ffff",
                "index": 0
            }
        ],
        "fromBuffer": [
            {
                "exception": "Transaction has unexpected data",
                "hex": "0100000002f1fefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefe000000006b483045022100e661badd8d2cf1af27eb3b82e61b5d3f5d5512084591796ae31487f5b82df948022006df3c2a2cac79f68e4b179f4bbb8185a0bb3c4a2486d4405c59b2ba07a74c2101210279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798fffffffff2fefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefe0100000083483045022100be54a46a44fb7e6bf4ebf348061d0dace7ddcbb92d4147ce181cf4789c7061f0022068ccab2a89a47fc29bb5074bca99ae846ab446eecf3c3aaeb238a13838783c78012102c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee517a9147ccb85f0ab2d599bc17246c98babd5a20b1cdc7687ffffffff0250c30000000000001976a914c42e7ef92fdb603af844d064faad95db9bcdfd3d88acf04902000000000017a9147ccb85f0ab2d599bc17246c98babd5a20b1cdc768700000000ffffffff"
            }
        ]
    }
};
