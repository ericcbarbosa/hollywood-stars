'use strict';

function CelebritiesService() {

    var toUrl = function(string) {
        return string.trim().toLowerCase().split(' ').join('-');
    }

    var celebrities = [
        {
            id: 1,
            name: 'Sandy Lima',
            urlName: toUrl('Sandy Lima'),
            description: 'cantora, compositora e atriz brasileira. Cantora desde a infância, Sandy começou sua carreira em 1990, quando formou com o irmão, o músico Junior Lima, a dupla vocal Sandy & Junior.',
            image: 'http://images.virgula.com.br/2015/02/sandy.jpg',
        }, {
            id: 2,
            name: 'Manu Gavassi',
            urlName: toUrl('Manu Gavassi'),
            description: 'Manoela Latini Gavassi Francisco, mais conhecida como Manu Gavassi, é uma cantora, compositora, atriz e autora brasileira',
            image: 'http://metropolitanafm.com.br/wp-content/uploads/2016/07/capa-manu-gavassi.jpg',
        }, {
            id: 3,
            name: 'Paula Fernandes',
            urlName: toUrl('Paula Fernandes'),
            description: 'cantora e compositora brasileira. Cantora desde a infância, Fernandes começou a cantar profissionalmente aos oito anos de idade',
            image: 'http://www.assisnews.com.br/wp-content/uploads/2017/12/paula_fernandes-1.jpg',
        }, {
            id: 4,
            name: 'Joana Borges',
            urlName: toUrl('Joana Borges'),
            description: 'é uma jovem actriz portuguesa. Começou por fazer parte do coro infantil " Jovens Cantores de Lisboa" para ingressar no grupo musical " OndaChoc".',
            image: 'http://s2.glbimg.com/fYMxgE75WaHjEhWzSz1ID0LXZAw=/475x475/top/i.glbimg.com/og/ig/infoglobo/f/original/2017/01/09/joanaborges.png',
        }, {
            id: 5,
            name: 'Paola Oliveira',
            urlName: toUrl('Paola Oliveira'),
            description: 'Paolla Oliveira é descendente de espanhóis, italianos e portugueses. Ela é filha de um policial militar aposentado e de uma ex-auxiliar de enfermagem',
            image: 'https://patricinhaesperta.com.br/wp-content/uploads/2013/05/paola-oliveira.jpg',
        }, {
            id: 6,
            name: 'Marina Ruy Barbosa',
            urlName: toUrl('Marina Ruy Barbosa'),
            description: 'Marina Souza Ruy Barbosa Negrão é uma atriz brasileira. Começou a atuar ainda criança, e fez seu primeiro trabalho de destaque no papel de Aninha na telenovela Começar de Novo.',
            image: 'http://s2.glbimg.com/Zpl4bjt56sjaF0zb9x3pK4-oPWM=/e.glbimg.com/og/ed/f/original/2017/08/07/marn.jpg',
        }
    ];

    return celebrities;
};

module.exports = CelebritiesService;