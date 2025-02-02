import { createApp } from 'vue';
import FoldersList from './components/FoldersList.vue';

const host = document.querySelector('.fb0a63fb');
console.log(host);
const appContainer = document.createElement('div');
appContainer.id = 'folders-list';
host.prepend(appContainer);

createApp(FoldersList).mount('#folders-list');