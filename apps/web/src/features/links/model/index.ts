export function useLink() {
  function createNewLink() {
    console.log("createNewLink");
  }

  return {
    createNewLink,
  };
}
