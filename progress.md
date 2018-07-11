up to video 11

//mutation
mutation m{
  createVideo(title: "Getting Reactive with React", duration: 250, released: true){
    id,
    title
  }
}

//mutation with input type

mutation m{
  createVideo(video: {
        title: "Getting Reactive with React", 
        duration: 300,
        released: false
  }) {
      id
      title
  }
}

//list all video titles
{
  videos{
    title
  }
}

{
  node(id: "VmlkZW86YQ=="){
    ... on Video{
      title
    }
  }
}

