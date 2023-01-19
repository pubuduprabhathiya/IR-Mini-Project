import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';


export default function SongCard(props) {
  return (
    <Card variant="outlined"   sx={{width: "100%", justifyContent: 'center'  }}>
      <CardContent>
        <Typography variant="h5" component="div">
          Song Name: {props.document._source.Title}
        </Typography>
        <Typography  color="text.secondary" gutterBottom variant="h6">
        Artists: {props.document._source.Artists}
        </Typography>
        <Grid container
            direction="column"
            sx={{marginTop:'10px'}}>
            <Grid item xs={2}>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Lyricists: {props.document._source.Lyricists}
            </Typography>
            </Grid>
            <Grid item xs={6}>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Music Composers: {props.document._source["Music Composers"]}
            </Typography>
            </Grid>
            <Grid item xs={6}>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Genre: {props.document._source.Genre}
            </Typography>
            </Grid>
        </Grid>
        
        

        <Grid container direction='row'>
            <Grid item xs={2}>
            Lyrics
            </Grid>
            <Grid item xs={10}>
            {props.document._source.Lyrics}
            </Grid>
        </Grid>

        <Typography variant="body2">
        </Typography>
      </CardContent>
      <CardActions>
       
      </CardActions>
    </Card>
  );
}