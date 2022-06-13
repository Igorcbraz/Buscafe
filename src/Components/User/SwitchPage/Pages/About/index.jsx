import { useEffect } from 'react';
import { useChurches } from "../../../../../hooks/useChurches";

import { Alert, Skeleton, Stack } from '@mui/material';
import { Facebook } from '@mui/icons-material';

import { AboutViewModeStyles } from "./styles"

// Setting CheckBox
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export function AboutViewMode(){
    const { church, getChurch, churchAbout, getChurchAbout } = useChurches();  
    
    useEffect(async () => {
        await getChurchAbout(church.id_corp);
      }, [])
      

    return churchAbout.length != 0 ?(
        <AboutViewModeStyles>
            <div className="about-container">
                <div className="info-section">
                    <div className="info-title"> 
                        DESCRIÇÃO
                    </div>
                    
                    <div className="info-item">
                        {church.corpDesc}
                    </div>
                </div>
                {churchAbout.code === 2 ? (
                    <Alert severity='info'>{churchAbout.msg}</Alert> 
                ) : (
                    <>
                        <div className="info-section">
                            <div className="info-title">CONTATO</div>
                            <div className="info-item">
                                {churchAbout.cellphone}
                            </div>
                            <div className="info-item">
                                {churchAbout.email}
                            </div>
                        </div>

                        <div className="info-section">
                            <div className="info-title">REDES SOCIAIS</div>
                            <div className="info-item">
                                {console.log(churchAbout.link)}
                                {churchAbout.link != 'Facebook não cadastrado' ? (
                                    <a href={`https:/${churchAbout.link}`}  target="_blank" class="link"><Facebook /></a>
                                ): (
                                    churchAbout.link  
                                )}
                            </div>
                        </div>
                        <div className="info-section">
                            <div className="info-title">INFORMAÇÕES DO TEMPLO</div>
                            <div className="info-item">
                                Número de assentos: <strong>{churchAbout.seats}</strong>
                            </div>

                            <div className="info-item">
                                {churchAbout.parking && "Possui Estacionamento"}
                            </div>

                            <div className="info-item">
                                {churchAbout.accessibility && "Possui Acessibilidade"}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AboutViewModeStyles>
    ):(
        <Stack spacing={1}>
            <Skeleton variant="text" animation="wave" />
            <Skeleton variant="text" animation="wave" />
            <Skeleton variant="text" animation="wave" />
        </Stack> 
    ) 
}
