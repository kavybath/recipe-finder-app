import { useState } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Header from './components/header';
import { RecipeContainer,CoverImage, RecipeName, IngredientsText, SeeMoreText } from './components/recipe';

const APP_ID = "a3da4773";
const APP_KEY = "dd42b7c6bdf62fda49ec7edd58b3c154";

const Container = styled.div`
display: flex;
flex-direction: column;
`;

const RecipeListContainer = styled.div`
display: flex;
flex-direction: row;
flex-wrap: wrap;
padding: 30px;
gap: 20px;
justify-content: space-evenly;
`;

const Placeholder = styled.img`
width: 120px;
height: 120px;
margin: 200px;
opacity: 50%;
`;
function App() {
  const [timeoutId, setTimeoutId] = useState();
  const [recipeList, setRecipeList] = useState([]);

  const fetchrecipe = async (searchString) => {
    const response = await Axios.get(`https://api.edamam.com/search?q=${searchString}&app_id=${APP_ID}&app_key=${APP_KEY}`);
    setRecipeList(response.data.hits);
  };

  const onSearchTextChange = (e) => {
    clearTimeout(timeoutId);
    const timeout = setTimeout(() => 
    fetchrecipe(e.target.value), 500);
    setTimeoutId(timeout);
  }

  const RecipeComponent = (props) => {
    const [open, setOpen] = useState(false);
    const { recipeObj } = props;
    return (
      <>
      <Dialog open={open}>
        <DialogTitle id="alert-dialog-slide-title">
          Ingredients List
        </DialogTitle>
        <DialogContent>
            <table>
              <thead>
                <th>
                  Ingredients
                </th>
              </thead>
              <tbody>
                
              {recipeObj.ingredients.map((ingregidentObj) => 
                <tr> 
                  <td> {ingregidentObj.text} </td>
                </tr>
              )}
              </tbody>
            </table>
        </DialogContent>
        <DialogActions>
          <IngredientsText onClick={() => window.open(recipeObj.url)}> Click to see full Recipe </IngredientsText>
          <SeeMoreText onClick={() => setOpen(false)} > Close this window</SeeMoreText>
        </DialogActions>
      </Dialog>
      <RecipeContainer>
            <CoverImage src={recipeObj.image} />
            <RecipeName> {recipeObj.label} </RecipeName>
            <IngredientsText onClick={() => setOpen(true)}> Ingredients  </IngredientsText>
            <SeeMoreText onClick={ ()=> window.open(recipeObj.url)}> See complete Receipe </SeeMoreText>
          </RecipeContainer>
          </>
    );
  };
  return (
    <Container>
      <Header.Header> 
        <Header.AppNameComponent>
          <Header.AppIcon src="/soup.svg"/> Find Recipes </Header.AppNameComponent >
        <Header.SearchComponent>
          <Header.SearchIcon src="/search-icon.svg" />
          <Header.SearchInput placeholder='Search Here' onChange={onSearchTextChange}/> 
        </Header.SearchComponent>
        </Header.Header>
        <RecipeListContainer>
          {recipeList.length ? 
            ( recipeList.map((recipeObj) => (
            <RecipeComponent recipeObj={recipeObj.recipe} />
            )) ) : ( 
            <Placeholder src="/soup.svg" /> 
          )}
        </RecipeListContainer>
        
    </Container>  
  );
}

export default App;
