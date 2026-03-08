package com.midnight.spotify_clone.model;

public class Music {
    private String id; // id do spotify
    private String title;
    private String artist;
    private String album;
    private String coverUrl;
    private Integer duration;
    private String previewUrl; // spotify dá um preview de 30s gratuito

    public String getId(){
        return id;
    }   

    public void setId(String id){
        this.id = id;
    }

    public String getTitle(){
        return title;
    }

    public void setTitle(String title){
        this.title = title;
    }

    public String getArtist(){
        return artist;
    }

    public void setArtist(String artist){
        this.artist = artist;
    }

    public String getAlbum(){
        return album;
    }

    public void setAlbum(String album){
        this.album = album;
    }

    public String getCoverUrl(){
        return coverUrl;
    }

    public void setCoverUrl(String coverUrl){
        this.coverUrl = coverUrl;
    }

    public Integer getDuration(){
        return duration;
    }

    public void setDuration(Integer duration){
        this.duration = duration;
    }

    public String getPreviewUrl(){
        return previewUrl;
    }

    public void setPreviewUrl(String previewUrl){
        this.previewUrl = previewUrl;
    }
}
