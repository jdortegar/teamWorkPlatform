import _ from 'lodash';

// returns an object with all folders and files ids in the tree
export const getAllIdsFromTree = tree =>
  _.reduce(
    _.pick(tree, ['folders', 'files']),
    (acc, values, key) => {
      if (key === 'files') {
        // add all files ids
        acc.files = _.concat(acc.files, values.map(f => f.file_id));
      }
      if (key === 'folders') {
        // add all folders ids
        acc.folders = _.concat(acc.folders, values.map(f => f.folder_id));

        // keep going recursively on each folder
        values.map(getAllIdsFromTree).forEach(item => {
          acc.folders = _.concat(acc.folders, item.folders);
          acc.files = _.concat(acc.files, item.files);
        });
      }
      return acc;
    },
    { files: [], folders: [] }
  );

// returns an object with all the children folders and files ids of a given folder
export const getAllChildrenIds = (tree, folderId) =>
  _.reduce(
    _.pick(tree, 'folders'),
    (acc, values, key) => {
      if (key === 'folders') {
        // find the given folder
        const folder = values.find(f => f.folder_id === folderId);
        if (folder) {
          // add all folders and files ids from the children
          const { folders, files } = getAllIdsFromTree(folder);
          acc.folders = _.concat(acc.folders, [folder.folder_id], folders);
          acc.files = _.concat(acc.files, files);
        } else {
          // keep searching recursively
          values.forEach(f => {
            const { folders, files } = getAllChildrenIds(f, folderId);
            acc.folders = _.concat(acc.folders, folders);
            acc.files = _.concat(acc.files, files);
          });
        }
      }
      return acc;
    },
    { files: [], folders: [] }
  );

// returns an object with all selected files and folders ids, including its parents
export const getAllParentIds = (tree, folders = [], files = []) =>
  _.reduce(
    _.pick(tree, ['files', 'folders']),
    (acc, values, key) => {
      if (key === 'files') {
        // add the parents of the selected files
        acc.folders = _.concat(acc.folders, values.filter(f => files.includes(f.file_id)).map(f => f.parent_id));
      }
      if (key === 'folders') {
        // go recursively through the tree
        values.forEach(folder => {
          acc.folders = _.concat(acc.folders, ...getAllParentIds(folder, folders, files).folders);
        });
        // add the parents of the selected folders, including folders that were just added above
        acc.folders = _.concat(
          acc.folders,
          values.filter(f => acc.folders.includes(f.folder_id)).map(f => f.parent_id)
        );
      }
      acc.folders = _.uniq(_.compact(acc.folders));
      return acc;
    },
    { files, folders: [] }
  );
