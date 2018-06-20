'use strict';

function CelebritiesService() {

    var celebrities = [
        {
            id: 1,
            name: {
                birth: 'Marina Souza Ruy Barbosa Negrão',
                artistic: 'Marina Ruy Barbosa',
            },
            urlName: 'marina-ruy-barbosa',
            description: 'Marina Souza Ruy Barbosa Negrão é uma atriz brasileira. Começou a atuar ainda criança, e fez seu primeiro trabalho de destaque no papel de Aninha na telenovela Começar de Novo.',
            image: 'https://www.ibahia.com/fileadmin/user_upload/ibahia/2017/julho/13/marina1111.jpg',
            birthdate: '28/01/1983',
            gender: 'Female',
            height: '1.58',
            occupation: 'Singer',
        }, {
            id: 2,
            name: {
                birth: 'Bruno Gagliasso Marques',
                artistic: 'Bruno Gagliasso',
            },
            urlName: 'bruno-gagliasso',
            description: 'Começou a carreira ainda criança, em 1990, fazendo figuração em novelas da Rede Globo. Em 1999 participou do episódio "Papai é Gay!", do programa Você Decide.',
            image: 'https://www.otvfoco.com.br/wp-content/uploads/2017/08/3530300927-bruno-gagliasso-e1503421087829.jpg',
            birthdate: '13/04/1982',
            gender: 'Male',
            height: '1.70',
            occupation: 'Actor',
        }, {
            id: 3,
            name: {
                birth: 'Paula Fernandes',
                artistic: 'Paula Fernandes',
            },
            urlName: 'paula-fernandes',
            description: 'cantora e compositora brasileira. Cantora desde a infância, Fernandes começou a cantar profissionalmente aos oito anos de idade',
            image: 'http://www.assisnews.com.br/wp-content/uploads/2017/12/paula_fernandes-1.jpg',
            birthdate: '28/08/1984',
            gender: 'Female',
            height: '1.65',
            occupation: 'Singer',
        }, {
            id: 4,
            name: {
                birth: 'Fausto Corrêa da Silva',
                artistic: 'Faustão',
            },
            urlName: 'fausto-silva',
            description: 'Fausto Corrêa da Silva, mais conhecido como Faustão, é um apresentador brasileiro que atualmente apresenta o programa de auditório Domingão do Faustão, da Rede Globo.',
            image: 'http://imagens.us/subcelebridades/fausto-silva/fausto-silva%20(4).jpg',
            birthdate: '03/05/1950',
            gender: 'Male',
            height: '1.88',
            occupation: 'Presenter',
        }, {
            id: 5,
            name: {
                birth: 'Paolla Oliveira',
                artistic: 'Paolla Oliveira',
            },
            urlName: 'paola-oliveira',
            description: 'Paolla Oliveira é descendente de espanhóis, italianos e portugueses. Ela é filha de um policial militar aposentado e de uma ex-auxiliar de enfermagem',
            image: 'https://patricinhaesperta.com.br/wp-content/uploads/2013/05/paola-oliveira.jpg',
            birthdate: '28/01/1983',
            gender: 'Female',
            height: '1.58',
            occupation: 'Singer',
        }, {
            id: 6,
            name: {
                birth: 'Sandy Lima',
                artistic: 'Sandy Lima',
            },
            urlName: 'sandy-lima',
            description: 'cantora, compositora e atriz brasileira. Cantora desde a infância, Sandy começou sua carreira em 1990, quando formou com o irmão, o músico Junior Lima, a dupla vocal Sandy & Junior.',
            image: 'http://images.virgula.com.br/2015/02/sandy.jpg',
            birthdate: '28/01/1983',
            gender: 'Female',
            height: '1.58',
            occupation: 'Singer',
        },
    ];

    var service = {

        toUrl: function(string) {
            return string.trim().toLowerCase().split(' ').join('-');
        },

        toCapitalize: function(string) {
            var slices = string.split('-');
            var capitalizedSlices = [];

            slices.forEach( function(word) {
                capitalizedSlices.push( word.charAt(0).toUpperCase() + word.slice(1) );
            });

            return capitalizedSlices.join(' ');
        },

        getCelebrities: function () {
            console.log('celebrities: ', celebrities);
            return celebrities;
        },

        add: function ( celebrity ) {
            var localStorageList = JSON.parse( localStorage.getItem("celebritiesList") );

            if ( localStorageList ) {
                localStorageList.push( celebrity );
                this.update( localStorageList );
            }

            else {
                localStorageList = [];
                localStorageList.push(celebrity);
                this.update( localStorageList );
            }

            return true;
        },

        get: function () {
            var celebritiesList = localStorage.getItem("celebritiesList") !== null
                                  ? JSON.parse( localStorage.getItem("celebritiesList") )
                                  : false;

            return celebritiesList;
        },

        search: function(id) {
            var celebritiesList = this.getCelebrities();
            var searchResult;

            id = parseInt(id);

            if ( celebritiesList ) {
                celebritiesList.map(function( celebrity ) {

                    if ( celebrity.id == id )
                        searchResult = celebrity;

                });
            }

            return searchResult;
        },

        update: function ( celebritiesList ) {
            localStorage.setItem('celebritiesList', JSON.stringify( celebritiesList ));
        },

        edit: function ( celebrity ) {
            this.delete( celebrity.id );
            this.add( celebrity );

            return this.get();
        },

        delete: function (id) {
            var celebritiesList = this.get();
            var deleted = false;

            id = parseInt(id);

            if ( celebritiesList ) {
                celebritiesList.map( function( celebrity, index ) {

                    if ( celebrity.id == id ) {
                        deleted = celebritiesList.splice(index, 1);
                    }

                });

                this.update( celebritiesList );
            }

            return deleted;
        },

    }

    return service;
};

module.exports = CelebritiesService;