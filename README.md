# StadLine Technical Test

## Installation & Lancement

```
npm install --production
node server/server.js
```
Puis aller sur 
```
http://127.0.0.1:9042/#!/nodejs/node/issue/6867
```
Enjoy ;-)

## Présentation générale

### Tâche

Le sujet de base est simple : il faut afficher le fil de discussion d'un ticket Github et déterminer qui est le plus bavard. L'habillage graphique est un peu différent de celui de Github, il y a un graphique, des filtres et dans l'idéal la possibilité d'ajouter un commentaire.

### Règles

* Le temps est libre mais il est tout de même conseillé de passer moins de 4h sur le sujet (temps de setup d'environnement compris). Ce n'est pas important si vous n'avez pas le temps de tout finir (ce n'est pas le but !)
* Il est conseillé de finir les points requis avant de s'attaquer au bonus.
* Il est aussi conseillé de faire un maximum de commits pour bien détailler les étapes de votre raisonnement au cours du développement.
* N'hésitez pas à nous faire des retours et nous expliquer les éventuelles problématiques bloquantes que vous auriez rencontrées durant le développement vous empéchant de finir.

### Setup

* La charte graphique est fournie partiellement (uniquement desktop pour l'instant). Vous pouvez utiliser un framework CSS. L'appli doit être responsive, avec le Desktop et le Smartphone en cibles principales.
* Vous pouvez utiliser un serveur NodeJS pour compiler vos fichiers, mais l'application doit pouvoir tourner entièrement dans le navigateur.
* Vous pouvez faire un fork de ce dépot, puis attaquer le sujet.

## Fonctionnalités

### Le fil de discussion

On doit pouvoir afficher les messages d'un ticket Github (ex : https://github.com/nodejs/node/issues/6867). L'idée est de pouvoir afficher n'importe quel ticket, l'url devrait donc contenir le chemin vers le ticket (on peut également passer par un formulaire pour indiquer l'url avant d'afficher quoi que ce soit).

```
http://mon-app.dev/#nodejs/node/issues/6867
```

Le style est fourni dans un PSD (https://github.com/stadline/js-technical-test/raw/master/doc/Mailapp.psd) + version PDF (https://github.com/stadline/js-technical-test/raw/master/doc/Mailapp.pdf).
Dans un premier temps, uniquement afficher le titre, la discussion, les avatars. Vous pouvez faire une distinction entre l'auteur de la discussion et les autres intervenants.

### Les filtres

Dans la partie de gauche on affichera la liste des participants : on doit pouvoir masquer certains participants. Le design n'étant pas fourni, vous êtes libres du rendu (checkboxes ? effet graphique ?). Masquer un participant fait disparaitre ses messages du fil de discussion.

### Le graphique

Afficher un graphique "pie chart" dans la partie gauche, avant la liste des participants. Cette partie s'appelle "Qui est le plus bavard ?".

https://github.com/stadline/js-technical-test/raw/master/doc/pie-sample.png

Le principe : classer les participants en fonction du nombre de mots écrits. Vous devrez donc compter le nombre de mot de chaque message et les regrouper par utilisateur.

Filtrer un participant le fait disparaitre du graphique.

### Bonus (pour les rapides !)

 * Ajouter un textarea sous la discussion pour permettre d'ajouter un commentaire. Il faudra faire un appel authentifié à l'API Github. Vous pouvez stocker les infos de connexion dans une configuration (pas besoin de formulaire de login).
 * Accompagner les changements d'affichage avec des animations (apparition / disparition des messages, mise à jour du graphique).
